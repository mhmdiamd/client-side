import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { ro } from 'date-fns/locale';
import { useState } from 'react';
import { useContext } from 'react';
import { SearchContext } from '../useContext/searchContext';
import useFetch from '../useHooks/useFetch';
import './reserve.css';
export const Reserve = ({ setOpen, hotelId }) => {
  const [selectRooms, setSelectRooms] = useState([]);
  const { data, loading, error } = useFetch(`http://localhost:8800/api/hotels/find/rooms/${hotelId}`);

  const clickHandler = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    setSelectRooms(checked ? [...selectRooms, value] : selectRooms.filter((room) => room != value));
  };

  const { dates } = useContext(SearchContext);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());

    let dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (unavailableDates) => {
    if (unavailableDates.length < 1) {
      return false;
    }
    const isFound = unavailableDates.some((date) => {
      allDates.includes(new Date(date).getTime());
    });

    return !isFound;
  };

  const checkHandler = async () => {
    try {
      await Promise.all(
        selectRooms.map((roomId) => {
          const res = axios.put(`http://localhost:8800/api/rooms/availability/${roomId}`, { dates: allDates });
          setOpen(false);
          return res.data;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <div className="rHeader">
          <span>Select Your Room : </span>
          <FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)} />
        </div>
        <div className="rItemContainer">
          {data?.map((item) => (
            <div className="rItem" key={item._id}>
              <div className="rItemInfo">
                <div className="rTitle">{item.name}</div>
                <div className="rUtils">
                  <div className="rPrice">${item.price} </div>
                  <div className="rMax">
                    Max People : <b>{item.maxPeople}</b>
                  </div>
                </div>
                <div className="rDesc">{item.desc}</div>
              </div>
              <div className="rRooms">
                {item.roomNumbers.map((room) => (
                  <div className="rRoom" key={room._id}>
                    <div className="rNumber">{room.number}</div>
                    <input className="rCheckRoom" value={room._id} type="checkbox" onChange={clickHandler} id={room.number} disabled={isAvailable(room.unavailableDates)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="rBtn-reserve" onClick={checkHandler}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};
