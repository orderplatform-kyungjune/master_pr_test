import {
  ref,
  computed,
} from 'vue';
import {
  acceptHMRUpdate,
  defineStore,
} from 'pinia';
import dayjs,
{ ManipulateType } from 'dayjs';
import {
  DashboardResultType,
  requestDashboardParams,
} from '@interfaces/Dashboard';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import requestDashboardData from '@apis/dashboard';

const useDashboardStore = defineStore('Dashboard', () => {
  const { useApiRequest } = useMasterApiRequest();
  const getStartAndEndOfWeek = (date: dayjs.Dayjs) => ({
    start: date.startOf('week'),
    end: date.endOf('week'),
  });

  const selectedDate = ref<dayjs.Dayjs>(dayjs());
  const selectedWeek = computed(() => getStartAndEndOfWeek(selectedDate.value));

  const selectDate = (day: dayjs.Dayjs | null) => {
    if (day) {
      selectedDate.value = day;
    }
  };

  const resetDate = () => {
    selectedDate.value = dayjs();
  };

  const today = dayjs();
  const earliestDate = dayjs('2022-01-01');

  const getLatestDateByType = (type: ManipulateType | undefined) => {
    const sameYear = selectedDate.value.isSame(today, 'year');
    const sameMonth = selectedDate.value.isSame(today, 'month');
    const sameWeek = selectedDate.value.isSame(today, 'week');
    const sameDay = selectedDate.value.isSame(today, 'day');

    switch (type) {
      case 'day':
        return sameYear && sameMonth && sameDay;
      case 'week':
        return sameYear && sameMonth && sameWeek;
      case 'month':
        return sameYear && sameMonth;
      case 'year':
        return sameYear;
      default:
        return false;
    }
  };

  const getEarliestDateByType = (type: ManipulateType | undefined) => {
    const sameYear = selectedDate.value.isSame(earliestDate, 'year');
    const sameMonth = selectedDate.value.isSame(earliestDate, 'month');
    const sameWeek = selectedDate.value.isSame(earliestDate, 'week');
    const sameDay = selectedDate.value.isSame(earliestDate, 'day');

    switch (type) {
      case 'day':
        return sameYear && sameMonth && sameDay;
      case 'week':
        return sameYear && sameMonth && sameWeek;
      case 'month':
        return sameYear && sameMonth;
      case 'year':
        return sameYear;
      default:
        return false;
    }
  };

  const permuteSelectedDate = (isIncrease: boolean, type: ManipulateType | undefined) => {
    if (isIncrease) {
      if (getLatestDateByType(type)) {
        return;
      }
      selectedDate.value = selectedDate.value.add(1, type);
    } else {
      if (getEarliestDateByType(type)) {
        return;
      }
      selectedDate.value = selectedDate.value.subtract(1, type);
    }
  };

  const getDayOfWeek = (date: dayjs.Dayjs) => {
    const daysOfWeek = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];
    return daysOfWeek[date.day()];
  };

  const selectedDayOfWeek = computed(() => getDayOfWeek(selectedDate.value));

  const refDashboardData = ref<DashboardResultType>({} as DashboardResultType);
  const dashboardData = computed({
    get: () => refDashboardData.value,
    set: (data: DashboardResultType) => {
      refDashboardData.value = data;
    },
  });

  const getDashboardData = (type: string) => {
    const params: requestDashboardParams = {
      type,
      start_date: selectedDate.value.format('YYYY-MM-DD'),
      end_date: selectedDate.value.format('YYYY-MM-DD'),
    };

    const {
      call,
      loading,
    } = useApiRequest(requestDashboardData, (data: DashboardResultType) => {
      dashboardData.value = data;
      dashboardData.value.donutChar = {
        series: [
          349,
          361,
          212,
          349,
          523,
          294,
          321,
        ],
        labels: [
          '월',
          '화',
          '수',
          '목',
          '금',
          '토',
          '일',
        ],
      };
    }, params, '대시보드');

    return {
      call,
      loading,
    };
  };

  const currentViewType = ref<ManipulateType | undefined>('day');
  const changeViewType = async (type: ManipulateType | undefined) => {
    currentViewType.value = type;
    switch (type) {
      case 'day':
        await getDashboardData('daily').call();
        break;
      case 'week':
        await getDashboardData('monthly').call();
        break;
      case 'month':
        await getDashboardData('monthly').call();
        break;
      case 'year':
        await getDashboardData('yearly').call();
        break;
      default:
        break;
    }
  };

  return {
    currentViewType,
    selectedDate,
    selectedWeek,
    selectedDayOfWeek,
    dashboardData,
    changeViewType,
    selectDate,
    resetDate,
    permuteSelectedDate,
    getStartAndEndOfWeek,
    getDashboardData,
  };
});

export default useDashboardStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
}
