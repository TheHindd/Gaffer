import React from 'react';
import { ScheduleComponent, Resize, ViewsDirective, ViewDirective, DragAndDrop, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
//import {DatePickerComponent} from '@syncfusion/ej2-react-schedule'
//import {scheduleData} from '@syncfusion/ej2-react-schedule'
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';


const CalendarPage = () => {
  return (
    <div className='m-2 md:m-10 p-2 md:p-10 bg-background rounded-3xl'>
       <SideBar/>
       <NavBar title="Calendar" /> 
       {/* <ScheduleComponent>
         <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}/>
       </ScheduleComponent> */}
    </div>
  )
}

export default CalendarPage
