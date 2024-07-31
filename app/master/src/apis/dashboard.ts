import { sendRequest } from '@utils/commonUtils';
import { requestDashboardParams } from '@interfaces/Dashboard';
import endpoints from '@apis/endpoints';

export const requestDashboardData = (params: requestDashboardParams) => sendRequest(endpoints.dashboard.masterDashboard, params);

export default requestDashboardData;
