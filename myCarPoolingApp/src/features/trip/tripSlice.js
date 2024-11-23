import {
    createSelector, 
    createEntityAdapter
} from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const tripsAdapter = createEntityAdapter({
    sortComparer:(a,b)=>(a.start_date_time === b.start_date_time)?0:a.start_date_time?1:-1
})

const initialState = tripsAdapter.getInitialState()

export const tripsApiSlice = apiSlice.injectEndpoints({
    endpoints:builder=>({
        getTrips: builder.query({
            query : ()=>'/trips',
            validateStatus : (response,result)=>{
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedTrips = responseData.map(trip =>
                    {   
                        trip.id = trip._id
                        return trip
                    });
                return tripsAdapter.setAll(initialState, loadedTrips)
            },
            providesTags: (result, error, arg)=>{
                if(result?.id){
                    return [
                        {type:'Trip', id:'LIST'},
                        ...result.ids.map(id=>({type:'Trip',id}))
                    ]
                } else return [{type:'Trip', id:'LIST'}]
            }
        }),
        getLocateDrivers:builder.mutation({
            query: (driverCoordinates) =>({
                url: '/trip/locate',
                method:'POST',
                body:driverCoordinates,
                headers:{
                    'Content-type':'application/json',
                },
            }),
            invalidatesTags:[
                {type:'Driver', id:'LIST'}
            ]
        })
        
    })
});

export const {useGetTripsQuery,
    useGetLocateDriversMutation} = tripsApiSlice;

export default tripsApiSlice;