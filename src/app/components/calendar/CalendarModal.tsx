import React, { useState } from 'react'
import Calendar from 'react-calendar';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarModal() {
  const [value, onChange] = useState<Value>(new Date());
  
  return (
    <div>
      <Calendar 
        locale='ko'
        onChange={() => onChange}
        value={value}
      />
    </div>
  )
}
