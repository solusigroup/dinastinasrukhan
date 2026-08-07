import { Heart } from 'lucide-react';
import type { FamilyMember } from '@/types';

type TreeNodeProps = {
    member: FamilyMember;
    depth?: number;
    onNodeClick?: (member: FamilyMember) => void;
};

export function TreeNode({ member, depth = 0, onNodeClick }: TreeNodeProps) {
    const hasChildren = member.children_recursive && member.children_recursive.length > 0;
    const isDeceased = member.is_deceased || !!member.death_date;

    const depthColors = [
        'border-2 border-amber-400 bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20',
        'border-2 border-emerald-400 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20',
        'border-2 border-sky-400 bg-gradient-to-br from-sky-500/10 to-blue-500/10 shadow-md shadow-sky-500/10 hover:shadow-sky-500/20',
        'border-2 border-purple-400 bg-gradient-to-br from-purple-500/10 to-violet-500/10 shadow-sm shadow-purple-500/10 hover:shadow-purple-500/20',
        'border-2 border-rose-400 bg-gradient-to-br from-rose-500/10 to-pink-500/10 shadow-sm shadow-rose-500/10 hover:shadow-rose-500/20',
    ];

    const nodeColor = depthColors[Math.min(depth, depthColors.length - 1)];

    // Spouses who are currently married and still alive are displayed side-by-side (bersanding)
    const sideBySideSpouses = member.spouses?.filter(s => s.status !== 'divorced' && !s.death_date) || [];
    const otherSpouses = member.spouses?.filter(s => s.status === 'divorced' || s.death_date) || [];

    // Group children by spouse safely
    const childrenGroups = [];
    if (hasChildren) {
        const assignedChildIds = new Set();

        if (member.spouses && member.spouses.length > 0) {
            member.spouses.forEach(spouse => {
                // Use loose equality == to prevent string vs number mismatch drops
                const spouseChildren = member.children_recursive!.filter(c => c.parent_spouse_id == spouse.id);
                if (spouseChildren.length > 0) {
                    childrenGroups.push({ label: spouse.name, children: spouseChildren });
                    spouseChildren.forEach(c => assignedChildIds.add(c.id));
                }
            });
        }
        
        // Catch-all for children that didn't match any spouse (or have null spouse)
        const unassignedChildren = member.children_recursive!.filter(c => !assignedChildIds.has(c.id));
        if (unassignedChildren.length > 0) {
            childrenGroups.push({ 
                label: (member.spouses && member.spouses.length > 0) ? 'Lainnya / Tidak Diketahui' : 'Anak', 
                children: unassignedChildren 
            });
        }
    }

    const renderPrimaryCard = () => (
        <button
            onClick={() => onNodeClick?.({ ...member, generation: depth + 1 })}
            className={`relative cursor-pointer rounded-2xl border px-5 py-3 text-center transition-all duration-300 hover:scale-105 ${nodeColor} ${isDeceased ? 'opacity-70' : ''}`}
        >
            <div
                className={`mx-auto mb-2 flex h-10 w-10 overflow-hidden items-center justify-center rounded-full text-sm font-bold text-white ${
                    member.photo ? 'bg-transparent ring-2 ring-white/20' : (member.gender === 'male'
                        ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                        : 'bg-gradient-to-br from-pink-500 to-rose-600')
                }`}
            >
                {member.photo ? (
                    <img 
                        src={`/storage/${member.photo}`} 
                        alt={member.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerText = member.name.charAt(0);
                                e.currentTarget.parentElement.className = `mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${member.gender === 'male' ? 'bg-gradient-to-br from-sky-500 to-blue-600' : 'bg-gradient-to-br from-pink-500 to-rose-600'}`;
                            }
                        }}
                    />
                ) : (
                    member.name.charAt(0)
                )}
            </div>
            <p className="text-sm font-semibold text-foreground">{member.name}</p>
            
            {/* If no side-by-side spouses, show all spouses as bottom badges */}
            {sideBySideSpouses.length === 0 && member.spouses && member.spouses.length > 0 && (
                <div className="mt-2 flex flex-col items-center gap-1.5 border-t border-foreground/10 pt-2">
                    {member.spouses.map(spouse => (
                        <div key={spouse.id} className="flex items-center gap-1.5 rounded-full border border-sidebar-border/30 bg-muted/20 px-2.5 py-0.5 shadow-sm hover:bg-muted/30">
                            <div className={`flex h-4 w-4 overflow-hidden rounded-full items-center justify-center text-[7px] font-bold text-white ${spouse.photo ? '' : (spouse.gender === 'male' ? 'bg-gradient-to-br from-sky-400 to-blue-500' : 'bg-gradient-to-br from-pink-400 to-rose-500')}`}>
                                {spouse.photo ? (
                                    <img src={`/storage/${spouse.photo}`} alt={spouse.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                ) : (
                                    spouse.name.charAt(0)
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Heart className={`h-2.5 w-2.5 ${spouse.status === 'divorced' ? 'text-slate-400 opacity-60' : 'text-pink-400'}`} />
                                <span>{spouse.name}</span>
                                {spouse.status === 'divorced' && (
                                    <span className="rounded bg-slate-500/20 px-1 py-0.2 text-[9px] font-medium text-slate-400">Cerai</span>
                                )}
                                {spouse.death_date && (
                                    <span className="rounded bg-slate-500/20 px-1 py-0.2 text-[9px] font-medium text-slate-400">Alm</span>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* If side-by-side spouses exist, display only former/deceased spouses as bottom badges */}
            {sideBySideSpouses.length > 0 && otherSpouses.length > 0 && (
                <div className="mt-2 flex flex-col items-center gap-1 border-t border-foreground/10 pt-1.5">
                    {otherSpouses.map(spouse => (
                        <div key={spouse.id} className="flex items-center gap-1 rounded-full border border-sidebar-border/30 bg-muted/20 px-2 py-0.5 text-[10px] text-muted-foreground">
                            <Heart className={`h-2.5 w-2.5 ${spouse.status === 'divorced' ? 'text-slate-400 opacity-60' : 'text-pink-400 opacity-70'}`} />
                            <span>{spouse.name}</span>
                            {spouse.status === 'divorced' ? (
                                <span className="text-[9px] text-slate-400">(Cerai)</span>
                            ) : (
                                <span className="text-[9px] text-slate-400">(Alm)</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {member.birth_date && (
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                    {new Date(member.birth_date).getFullYear()}
                    {member.death_date && ` - ${new Date(member.death_date).getFullYear()}`}
                </p>
            )}
            {/* Generation badge */}
            <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                {depth + 1}
            </span>
                {isDeceased && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 rounded-full bg-black/80 px-2 py-0.5 text-[8px] font-bold text-white shadow-md border border-black/50 whitespace-nowrap" title="Almarhum/Almarhumah">
                        <span className="inline-block w-2.5 h-3 mr-0.5" style={{ background: 'linear-gradient(135deg, #1a1a1a 25%, #333 50%, #1a1a1a 75%)', clipPath: 'polygon(0 0, 40% 0, 50% 15%, 60% 0, 100% 0, 100% 100%, 60% 80%, 50% 100%, 40% 80%, 0 100%)' }} />
                        Wafat
                    </span>
                )}
        </button>
    );

    return (
        <div className="flex flex-col items-center">
            {/* Main Node or Side-by-side Pair */}
            {sideBySideSpouses.length > 0 ? (
                <div className="flex items-center gap-2 rounded-3xl border-2 border-sidebar-border bg-background/50 p-2 backdrop-blur-xs shadow-sm">
                    {renderPrimaryCard()}

                    {sideBySideSpouses.map(spouse => (
                        <div key={spouse.id} className="flex items-center gap-2">
                            {/* Heart Connector */}
                            <div className="flex flex-col items-center justify-center px-0.5 z-10">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-500 shadow-sm animate-pulse">
                                    <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                                </div>
                                <span className="text-[9px] font-extrabold text-pink-500 mt-0.5 tracking-wider uppercase">Nikah</span>
                            </div>

                            {/* Spouse Card */}
                            <button
                                onClick={() => onNodeClick?.({ ...member, generation: depth + 1 })}
                                className={`relative cursor-pointer rounded-2xl border-2 px-5 py-3 text-center transition-all duration-300 hover:scale-105 ${
                                    spouse.gender === 'male'
                                        ? 'border-sky-400 bg-gradient-to-br from-sky-500/15 to-blue-500/15 shadow-md shadow-sky-500/10 hover:shadow-sky-500/20'
                                        : 'border-pink-400 bg-gradient-to-br from-pink-500/15 to-rose-500/15 shadow-md shadow-pink-500/10 hover:shadow-pink-500/20'
                                }`}
                            >
                                <div
                                    className={`mx-auto mb-2 flex h-10 w-10 overflow-hidden items-center justify-center rounded-full text-sm font-bold text-white ${
                                        spouse.photo ? 'bg-transparent ring-2 ring-white/20' : (spouse.gender === 'male'
                                            ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                                            : 'bg-gradient-to-br from-pink-500 to-rose-600')
                                    }`}
                                >
                                    {spouse.photo ? (
                                        <img 
                                            src={`/storage/${spouse.photo}`} 
                                            alt={spouse.name} 
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                if (e.currentTarget.parentElement) {
                                                    e.currentTarget.parentElement.innerText = spouse.name.charAt(0);
                                                    e.currentTarget.parentElement.className = `mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${spouse.gender === 'male' ? 'bg-gradient-to-br from-sky-500 to-blue-600' : 'bg-gradient-to-br from-pink-500 to-rose-600'}`;
                                                }
                                            }}
                                        />
                                    ) : (
                                        spouse.name.charAt(0)
                                    )}
                                </div>
                                <p className="text-sm font-semibold text-foreground">{spouse.name}</p>

                                {spouse.birth_date && (
                                    <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                                        {new Date(spouse.birth_date).getFullYear()}
                                    </p>
                                )}

                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm" title="Pasangan">
                                    ♥
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                renderPrimaryCard()
            )}

            {/* Connector and children */}
            {hasChildren && childrenGroups.length > 0 && (
                <div className="flex flex-col items-center mt-2">
                    {/* Vertical connector down from parent */}
                    <div className="h-8 w-[3px] rounded-full bg-gradient-to-b from-slate-400 to-slate-300" />

                    {/* Groups container — horizontal bar is placed inside so it inherits proper width */}
                    <div className="relative flex gap-12 justify-center">
                        {/* Horizontal bar spanning across all spouse groups */}
                        {childrenGroups.length > 1 && (
                            <div
                                className="absolute top-0 left-0 right-0 h-[3px] rounded-full bg-slate-400/80 z-0"
                            />
                        )}

                        {childrenGroups.map((group, groupIdx) => (
                            <div key={groupIdx} className="flex flex-col items-center relative z-10">
                                {/* Vertical drop from horizontal bar to group label */}
                                {childrenGroups.length > 1 && (
                                    <div className="h-6 w-[3px] rounded-full bg-slate-400/70 mb-1" />
                                )}

                                {/* Group Label (Spouse Name) if there are multiple groups */}
                                {childrenGroups.length > 1 && (
                                    <div className="mb-2 rounded-full border-2 border-pink-400/40 bg-pink-500/10 px-3 py-1 text-[10px] font-semibold text-pink-500 shadow-sm">
                                        Anak dari: {group.label}
                                    </div>
                                )}
                                
                                {/* Vertical connector from label to children */}
                                {childrenGroups.length > 1 && (
                                    <div className="h-5 w-[3px] rounded-full bg-slate-400/60 mb-1" />
                                )}

                                {/* Horizontal bar for the children of THIS group */}
                                {group.children.length > 1 && (
                                    <div className="relative w-full" style={{ height: '3px' }}>
                                        <div
                                            className="h-[3px] rounded-full bg-slate-400/70 absolute top-0"
                                            style={{
                                                left: `${50 / group.children.length}%`,
                                                right: `${50 / group.children.length}%`
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Render descendants */}
                                <div className="flex gap-6 pt-2">
                                    {group.children.map((child) => (
                                        <div key={child.id} className="flex flex-col items-center relative">
                                            {group.children.length > 1 && (
                                                <div className="h-5 w-[3px] rounded-full bg-slate-400/60 absolute -top-2" />
                                            )}
                                            <TreeNode member={child} depth={depth + 1} onNodeClick={onNodeClick} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

