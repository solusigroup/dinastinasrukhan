import FamilyTreeController from './FamilyTreeController'
import PendingApprovalController from './PendingApprovalController'
import DashboardController from './DashboardController'
import FamilyMemberController from './FamilyMemberController'
import FamilyMosaicController from './FamilyMosaicController'
import ChatController from './ChatController'
import Admin from './Admin'
import ActivityLogController from './ActivityLogController'
import Settings from './Settings'
const Controllers = {
    FamilyTreeController: Object.assign(FamilyTreeController, FamilyTreeController),
PendingApprovalController: Object.assign(PendingApprovalController, PendingApprovalController),
DashboardController: Object.assign(DashboardController, DashboardController),
FamilyMemberController: Object.assign(FamilyMemberController, FamilyMemberController),
FamilyMosaicController: Object.assign(FamilyMosaicController, FamilyMosaicController),
ChatController: Object.assign(ChatController, ChatController),
Admin: Object.assign(Admin, Admin),
ActivityLogController: Object.assign(ActivityLogController, ActivityLogController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers