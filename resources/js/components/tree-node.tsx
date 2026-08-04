import { Heart } from 'lucide-react';
import type { FamilyMember } from '@/types';

type TreeNodeProps = {
    member: FamilyMember;
    depth?: number;
    onNodeClick?: (member: FamilyMember) => void;
};

export function TreeNode({ member, depth = 0, onNodeClick }: TreeNodeProps) {
    const hasChildren = member.children_recursive && member.children_recursive.length > 0;
    const isDeceased = !!member.death_date;

    const depthColors = [
        'border-amber-400/60 bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20',
        'border-emerald-400/50 bg-gradient-to-br from-emerald-500/15 to-teal-500/15 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20',
        'border-sky-400/40 bg-gradient-to-br from-sky-500/10 to-blue-500/10 shadow-md shadow-sky-500/10 hover:shadow-sky-500/20',
        'border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-violet-500/10 shadow-sm shadow-purple-500/10 hover:shadow-purple-500/20',
        'border-rose-400/30 bg-gradient-to-br from-rose-500/10 to-pink-500/10 shadow-sm shadow-rose-500/10 hover:shadow-rose-500/20',
    ];

    const nodeColor = depthColors[Math.min(depth, depthColors.length - 1)];

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

    return (
        <div className="flex flex-col items-center">
            {/* Main Node */}
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
                
                {member.spouses && member.spouses.length > 0 && (
                    <div className="mt-2 flex flex-col items-center gap-1.5 border-t border-foreground/10 pt-2">
                        {member.spouses.map(spouse => (
                            <div key={spouse.id} className="flex items-center gap-1.5 rounded-full border border-sidebar-border/30 bg-muted/20 pr-3 shadow-sm hover:bg-muted/30">
                                <div className={`flex h-5 w-5 overflow-hidden rounded-full items-center justify-center text-[8px] font-bold text-white ${spouse.photo ? '' : (spouse.gender === 'male' ? 'bg-gradient-to-br from-sky-400 to-blue-500' : 'bg-gradient-to-br from-pink-400 to-rose-500')}`}>
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
                                </span>
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
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm">
                    {depth + 1}
                </span>
            </button>

            {/* Connector and children */}
            {hasChildren && childrenGroups.length > 0 && (
                <div className="flex flex-col items-center mt-2">
                    {/* Vertical connector down from parent */}
                    <div className="h-6 w-px bg-gradient-to-b from-muted-foreground/30 to-muted-foreground/10" />

                    {/* If multiple spouse groups, create a horizontal split for the groups */}
                    {childrenGroups.length > 1 && (
                        <div className="relative flex items-center justify-center mb-2">
                            <div
                                className="absolute top-0 h-px bg-muted-foreground/20"
                                style={{
                                    width: `calc(100% - ${(100 / childrenGroups.length)}%)`,
                                }}
                            />
                        </div>
                    )}

                    <div className="flex gap-12 justify-center">
                        {childrenGroups.map((group, groupIdx) => (
                            <div key={groupIdx} className="flex flex-col items-center">
                                {/* Group Label (Spouse Name) if there are multiple groups or we want to be explicit */}
                                {childrenGroups.length > 1 && (
                                    <div className="mb-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-3 py-1 text-[10px] font-medium text-pink-500">
                                        Anak dari: {group.label}
                                    </div>
                                )}
                                
                                {childrenGroups.length > 1 && (
                                    <div className="h-4 w-px bg-muted-foreground/15 mb-2" />
                                )}

                                {/* Horizontal bar for the children of THIS group */}
                                {group.children.length > 1 && (
                                    <div className="relative flex items-center w-full">
                                        <div
                                            className="h-px bg-muted-foreground/20 absolute top-0"
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
                                                <div className="h-4 w-px bg-muted-foreground/15 absolute -top-2" />
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
