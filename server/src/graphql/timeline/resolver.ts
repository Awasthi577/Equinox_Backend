import { TimeLineService } from "../../services/timeline"

const query = {
    getTimeLine: async() => { 
        return await TimeLineService.getTimeLine()
    },
    getTimeLineOfYear: async(_:any, {year}: {year: number}) => {
        return await TimeLineService.getTimeLineOfYear(year)
    },
    getTimeLineOfMonth: async(_:any, {month}: {month: string}) => {
        return await TimeLineService.getTimeLineOfMonth(month)
    },
    getTimeLineOfDay: async(_:any, {date}: {date: string}) => {
        const dateInNumber = Number(date);
        return await TimeLineService.getTimeLineOfDay(dateInNumber)
    },
}

export const resolver = { queries: query }