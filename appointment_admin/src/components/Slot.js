
import styled, { createGlobalStyle } from 'styled-components'
import Column from './Column'
import { data } from '../data'
import { useReducer, useState } from 'react'
import { userRequest, publicRequest } from '../requestMethods'
import { useContext } from 'react'
import { SlotStatusContext } from '../context/SlotStatusContext'
import { Modal, Result, Spin, message, Radio, Alert } from 'antd'
import { slotStatuses } from '../context/apiCalls'
import { ACTION_TYPE, INITIAL_STATE_SLOT_REDUCER, bookingReducer } from '../reducers/slotBookingReducer'
import { AuthContext } from '../context/AuthContext'
import { ConsoleSqlOutlined, LoadingOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { getStartTimeFromTimingNoForDisabling } from '../utils/dateUtil'
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const PROGRAMNAMES = ["BAJMC", "BBA", "BCA", "M.Com", "MAJMC", "MBA", "MCA", "MA Economics", "MA English", "MSC Mathematics"]

const BoxContainer = styled.div`
    max-width: 110px;
    height: 75px;
    margin: 10px;
    padding: 10px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color:  "#6C757D";
    margin: 8px;
    border-radius: 8px;
    border-style: solid;
    border-color: #DEE2E6;
    border-width: 1px;
    cursor: pointer;
    transition: ease background-color 250ms;
    &:hover {
    transform: "scale(1)";
  }
  `
const OuterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Container = styled.div`
    width: 42vw;
    margin: 20px;
    padding: 20px;
    /* background-color: green; */
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    /* border-color: grey; */
    /* border-style: solid; */
    border-width: 1px;
    box-shadow: 0px 1px 9px -1px rgba(179,173,179,1);
`
const Studio = styled.div`
    height: 10vh;
    margin: 8px;
    display: flex;
    justify-content: space-between;
    border-bottom: solid;
    border-color: rgba(179,173,179,1);
    border-width: 1px;
    align-items: center;
`
const Slots = styled.div`
display: flex;
`
const Name = styled.p`
    font-weight: bold;
    font-size: 18px;
    align-self: center;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    color: #333;
`
const Span = styled.span`
    font-size: 10px;
    color: #333;
    font-weight: 400;
`
const Button = styled.button`
width: 40%;
height: 40px;
 background-color: ${props => props.disable ? "#6C757D" : "#d90429"};
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 5px;
  outline: 0;
  text-transform: uppercase;
  margin: 6px;
  cursor: pointer;
  transition: ease background-color 250ms;
  border: none;
  &:hover {
    background-color: #ef233c;
    transform: scale(0.96)
  }
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`
const Title = styled.h3`
    font-size: 18px;
    margin-bottom: 20px;
    margin-top: 40px;
`
const Form = styled.form`
`
const Input = styled.input`
    cursor: ${props => props.disabled == true ? 'not-allowed' : "pointer"};
    padding: 6px;
`
const Select = styled.select`
    margin: 10px;
    padding: 10px;
    border-radius: 4px;
`
const Option = styled.option`
    padding: 10px;
    margin: 10px;

`
const getStudioTypeFromStudioNo = (studioNo) => {
    if (studioNo == 4) {
        return 'numerical'
    } else {
        return 'theory'
    }
}
const getBookingInType = (arg) => {
    if (arg === false) {
        return 'past'
    } else {
        return 'current'
    }
}
const Slot = ({ setDatePickerOpen }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenTwo, setIsModalOpenTwo] = useState(false)
    const [isModalOpenType, setIsModalOpenType] = useState(false)
    const [isModalOpenYetAnother, setIsModalOpenYetAnother] = useState(false)
    const [programYetAnother, setProgramYetAnother] = useState("")
    const [programs, setPrograms] = useState([])
    const [semester, setSemester] = useState(SEMESTERS[0])
    const [programName, setProgramName] = useState(PROGRAMNAMES[0])
    const [programObjectSelected, setProgramObjectSelected] = useState({})
    const { activeId, dateString, unCheckSlotActive, dispatch, loading, bookedSlots, handleBulkOnActive, setBulkOn, bulkIdsActive, bulkOn } = useContext(SlotStatusContext)
    const [program, setProgram] = useState("")
    const [state, dispatchA] = useReducer(bookingReducer, INITIAL_STATE_SLOT_REDUCER)
    const { user } = useContext(AuthContext)
    const [messageApi, contextHolder] = message.useMessage();
    const [showButton, setShowButton] = useState(true)
    const [bookFor, setBookFor] = useState(''); // enums - teacher,admin
    const [allTeachers, setAllTeachers] = useState([]); // all teachers array
    const [isLoading, setIsLoading] = useState(false); // loading spinner
    const [selectedTeacher, setSelectedTeacher] = useState(null); // selected teacher
    const [Url, setUrl] = useState("")
    const header = {
        'Content-Type': 'application/json',
        'token': `Bearer ${user?.accestoken}`
    }
    const handleBook = () => {
        if (fullSlot) {
            setDatePickerOpen(false)
            setIsModalOpen(true)
            return;
        }
        if (activeId !== null) {
            setDatePickerOpen(false)
            setIsModalOpenType(true)
        } else {
            warning()
        }
    }
    const handleCancel = () => {
        setDatePickerOpen(true)
        setIsModalOpen(false)
    }
    const handleCancelTwo = () => {
        setDatePickerOpen(true)
        setIsModalOpenTwo(false)
    }
    const handleCancelType = () => {
        setSelectedTeacher(null)
        setDatePickerOpen(true)
        setIsModalOpenType(false)
    }

    // handle book for 
    const handleBookFor = async (value) => {
        setBookFor(value);
        if (value === 'teacher' && allTeachers?.length === 0) {
            setIsLoading(true);
            try {
                const res = await publicRequest.get('/user/booking');
                setAllTeachers(res.data?.teachers);
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        }
    }

    // handle select teacher 
    const handleSelectedTeacher = (e) => {
        let value = e.target.value;
        const teacher = allTeachers?.find(t => t?.email === value);
        setSelectedTeacher(teacher);
    }

    const handleCancelYetAnother = () => {
        setDatePickerOpen(true)
        setIsModalOpenYetAnother(false)
        setProgram("")
        setSelectedTeacher(null)
    }
    const handleOk = async (e) => {
        e.preventDefault()
        if (fullSlot) {
            setDatePickerOpen(true)
            setIsModalOpen(false)
            dispatchA({ type: ACTION_TYPE.BOOKING_START })
            const convertedArray = checkedState.map((element, index) => {
                if (element === true) {
                    return index + 1;
                }
            }).filter(Boolean);
            try {
                const res = await userRequest.post("/booking/bulk", {
                    slotNos: bulkIdsActive,
                    email: user.email,
                    slotBookingData: {
                        user: user._id,
                        program: program,
                        date: dateString,
                        userEmail: user.email
                    }
                })
                dispatchA({ type: ACTION_TYPE.BOOKING_SUCCESS })
                unCheckSlotActive()
                slotStatuses(dispatch, dateString)
                success(res.data)
                setFullSlot(false)
                setBulkOn(false)
                setCheckedState(new Array(data.length).fill(false))
                handleBulkOnActive([])
                return;
            } catch (err) {
                dispatchA({ type: ACTION_TYPE.BOOKING_FAIL })
                error()
                return;
            }
        }
        setDatePickerOpen(true)
        setIsModalOpen(false)
        dispatchA({ type: ACTION_TYPE.BOOKING_START })
        try {
            const res = await userRequest.post("/booking/admin", {
                slotNo: activeId,
                email: user.email,
                slotBookingData: {
                    user: user._id,
                    program: program,
                    date: dateString,
                    userEmail: user.email
                }
            })
            dispatchA({ type: ACTION_TYPE.BOOKING_SUCCESS })
            unCheckSlotActive()
            slotStatuses(dispatch, dateString)
            success(res.data)
        } catch (err) {
            dispatchA({ type: ACTION_TYPE.BOOKING_FAIL })
            error()
        }
    }
    const handleOkYetAnother = async (e) => {
        e.preventDefault()
        setDatePickerOpen(true)
        setIsModalOpenYetAnother(false)
        dispatchA({ type: ACTION_TYPE.BOOKING_START })
        try {
            const res = await publicRequest.post("/booking", {
                type: getStudioTypeFromStudioNo(Math.floor(activeId / 10)),
                timingNo: activeId % 10,
                email: selectedTeacher?.email,
                slotBookingData: {
                    user: selectedTeacher?._id,
                    program: program,
                    semester: semester,
                    degree: programName,
                    date: dateString,
                    userEmail: selectedTeacher?.email,
                    bookingByEmail: user?.email,
                    driveUrl: Url
                },
                programObject: programObjectSelected,
                bookingFrom: "admin",
                slotNo: activeId,
                bookingIn: getBookingInType(showButton),
            }, {
                headers: header
            })
            dispatchA({ type: ACTION_TYPE.BOOKING_SUCCESS })
            unCheckSlotActive()
            slotStatuses(dispatch, dateString)
            success(res.data)
            // slotStatusesWithType(dispatch, dateString, slotType, header)
        } catch (err) {
            dispatchA({ type: ACTION_TYPE.BOOKING_FAIL })
            error()
        }
    }
    const handleOkType = async (e) => {
        setIsModalOpenType(false)
        if (selectedTeacher != null) {
            setIsModalOpenYetAnother(true)
        }
        if (bookFor == "admin") {
            setIsModalOpen(true)
        }
    }
    const warning = () => {
        messageApi.open({
            type: 'warning',
            content: 'Please select the slot to book',
            style: {
                marginTop: "5vh",
                padding: "2px 10px"
            }
        });
    };
    const success = (data) => {
        setDatePickerOpen(false)
        Modal.success({
            title: 'Congratulations your booking is confirmed',
            content: (
                <div>
                    <p style={{ margin: '10px', padding: '10px', fontSize: '14px', fontWeight: 'bold' }}>{data.msg}</p>
                    <span style={{ margin: '5px', padding: '5px' }}>check your registered email for further details</span>
                </div>
            ),
            onOk() {
                setDatePickerOpen(true)
            }
        });
    };

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Sorry, your booking failed. Please try again!',
            style: {
                marginTop: "5vh"
            }
        });
    };
    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 110,
                alignSelf: 'center',
                marginTop: "10px",
                marginRight: "200px"
            }}
            spin
        />
    );
    useEffect(() => {
        const compareDates = () => {
            let yourDate = new Date()
            const offset = yourDate.getTimezoneOffset()
            yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))
            const presentDate = yourDate.toISOString().split('T')[0]

            let date1 = new Date(dateString).getTime();
            let date2 = new Date(presentDate).getTime();
            console.log(date2)
            if (date1 < date2) {
                setShowButton(false)
            } else if (date1 > date2) {
                setShowButton(true)
            } else {
                setShowButton(true)
            }
        };
        compareDates()
        setFullSlot(false)
        setBulkOn(false)
        setCheckedState(new Array(data.length).fill(false))
        handleBulkOnActive([])
    }, [dateString])

    const [checkedState, setCheckedState] = useState(new Array(data.length).fill(false))
    const [fullSlot, setFullSlot] = useState(false)
    const handleOnChangeSelect = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        )
        setCheckedState(updatedCheckedState);
        handleButtonTypeShow(updatedCheckedState)
        const convertedArray = updatedCheckedState.map((element, index) => {
            if (element === true) {
                return index + 1;
            }
        }).filter(Boolean);
        handleBulkOnActive(convertedArray)
    }
    const handleButtonTypeShow = (arrOfState) => {
        if (arrOfState.includes(true)) {
            setFullSlot(true)
            setBulkOn(true)
            unCheckSlotActive()
        } else {
            setFullSlot(false)
            setBulkOn(false)
        }
    }

    const [unavailableStudios, setUnavailableStuios] = useState([])
    const getStudioStatus = async () => {
        const studioStatus = await userRequest.get("/slot/active")
        return studioStatus.data
    }
    useEffect(() => {
        getStudioStatus().then(studioStatus => setUnavailableStuios(studioStatus))
    }, [])
    useEffect(() => {
        const elevenMinutes = 11 * 60 * 60  //10 minutes in ms which is buffer
        let currDateTime = new Date().getTime() - elevenMinutes
        if (bulkOn) {
            bulkIdsActive.map((bulkId) => {
                if (getStartTimeFromTimingNoForDisabling(bulkId % 10, dateString) < currDateTime) {
                    setShowButton(false)
                    console.log("disable full slot button")
                }
            })
        } else if (bulkOn == false) {
            if (activeId != null && getStartTimeFromTimingNoForDisabling(activeId % 10, dateString) < currDateTime) {
                setShowButton(false)
                console.log("disable button")
            } else if (activeId != null) {
                setShowButton(true)
                console.log("dont disable")
            } else {
                setShowButton(true)
            }
        } else {
            setShowButton(true)
        }
    }, [activeId, bulkOn])

    const getProgramList = async () => {
        try {
            const res = await publicRequest.get(`/program?semester=${semester}&programName=${programName}&fetchType=teacher`)
            setPrograms(res.data.programs)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getProgramList()
    }, [semester, programName])


    return (<OuterContainer>
        {contextHolder}
        <Container>
            <Spin indicator={antIcon} spinning={state.posting || loading} size='large'>
                <Studio>
                    <Name>Studio 1<Span>theory</Span><Input type='checkbox' id='studio1' disabled={bookedSlots.some(r => data[0].ids.includes(r)) || !unavailableStudios.filter((i) => { if (i._id === 1) return i })[0]?.activeStatus} checked={checkedState[0]} onChange={() => handleOnChangeSelect(0)} /></Name>
                    <Name>Studio 2<Span>theory</Span><Input type='checkbox' id='studio2' disabled={bookedSlots.some(r => data[1].ids.includes(r)) || !unavailableStudios.filter((i) => { if (i._id === 2) return i })[0]?.activeStatus} checked={checkedState[1]} onChange={() => handleOnChangeSelect(1)} /></Name>
                    <Name>Studio 3<Span>theory</Span><Input type='checkbox' id='studio3' disabled={bookedSlots.some(r => data[2].ids.includes(r)) || !unavailableStudios.filter((i) => { if (i._id === 3) return i })[0]?.activeStatus} checked={checkedState[2]} onChange={() => handleOnChangeSelect(2)} /></Name>
                    <Name>Studio 4<Span>numerical</Span><Input type='checkbox' id='studio4' disabled={bookedSlots.some(r => data[3].ids.includes(r)) || !unavailableStudios.filter((i) => { if (i._id === 4) return i })[0]?.activeStatus} checked={checkedState[3]} onChange={() => handleOnChangeSelect(3)} /></Name>
                </Studio>
                <Slots>
                    {data.map((item) => {
                        return <Column item={item} unavailableStudios={unavailableStudios} key={item.idx} />
                    })}
                </Slots>
            </Spin>
        </Container>
        {!(user?.role == "manager") && showButton && !fullSlot && <Button onClick={handleBook} disable={state.posting || loading}>Book Now</Button>}
        {!(user?.role == "manager" || user?.role == "pcs" || user?.role == "recorder") && fullSlot && showButton && <Button onClick={handleBook} disable={state.posting || loading}>Book Full Slot</Button>}
        {!( user?.role == "manager") && !showButton && <Button onClick={handleBook} disable={state.posting || loading}>Book for Past</Button>}
        <Modal title='Select Type' open={isModalOpenType} onOk={handleOkType} onCancel={handleCancelType} okButtonProps={{
            disabled: bookFor == "" ? true : (bookFor == "teacher" && selectedTeacher === null ? true : (bookFor == "admin" ? false : false))
        }}>
            <div className='d-flex mt-3'>
                <BoxContainer className={`${bookFor === "teacher" ? "bg-primary" : ""}`} onClick={() => handleBookFor('teacher')}>
                    <p className={`${bookFor === "teacher" ? "text-white" : ""}`}>
                        Book For Teacher
                    </p>
                </BoxContainer>
               {
                !(user?.role == "pcs") &&  <BoxContainer onClick={() => handleBookFor('admin')} className={`${bookFor === "admin" ? "bg-primary" : ""}`}>
                <p className={`${bookFor === "admin" ? "text-white" : ""}`}>
                    Book As Admin
                </p>
            </BoxContainer>
               }
            </div>
            {bookFor === "teacher" && <div className='w-100 my-2 px-2'>
                {isLoading ? <Spin />
                    :
                    <select name="teachers" value={selectedTeacher?.email || ""} id="teachers" className='form-control w-100' onChange={(e) => handleSelectedTeacher(e)}>
                        <option value="" selected disabled>Select Teacher</option>
                        {allTeachers?.map(teacher => {
                            let formatted = `${teacher?.name} ${teacher?.lastname} (${teacher.email})`
                            return (
                                <option value={teacher?.email} className='p-3'>{formatted}</option>
                            )
                        })}
                    </select>
                }
            </div>}
        </Modal>
        <Modal title={`You are booking slot for teacher`} open={isModalOpenYetAnother} onOk={handleOkYetAnother} onCancel={handleCancelYetAnother} okButtonProps={{ disabled: program === '' || Url === "" ? true : false }}>
            <Title>Select the program</Title>
            <Form>
                {/* <Input placeholder="eg: MBA" onChange={(e) => setProgram(e.target.value)} /> */}
                <Select name="semester" value={semester} onChange={(e) => setSemester(SEMESTERS[e.target.options.selectedIndex])}>
                    {
                        SEMESTERS && SEMESTERS.map((item, index) => (
                            <Option value={item} key={index}>{item}</Option>
                        ))
                    }
                </Select>
                <Select name="programName" value={programName} onChange={(e) => setProgramName(PROGRAMNAMES[e.target.options.selectedIndex])}>
                    {
                        PROGRAMNAMES && PROGRAMNAMES.map((item, index) => (
                            <Option value={item} key={index}>{item}</Option>
                        ))
                    }
                </Select>
                <Select name="programs" value={program} defaultValue={programs[0]?.courseName} onChange={(e) => {
                    setProgram(programs[e.target.options.selectedIndex]?.courseName)
                    setProgramObjectSelected(programs[e.target.options.selectedIndex])
                }}>
                    {
                        programs && programs.map((item) => (
                            <Option value={item?.courseName} key={item._id} >{item?.courseName}</Option>
                        ))
                    }
                </Select>
                {program === '' ? <div style={{ marginLeft: '10px' }}>
                    <span style={{ color: 'red' }}>*Please select a program*</span>
                </div> : ''}
                <div>
                    <label>
                        URL of File<span className='text-danger'>*</span>
                    </label>
                    <input type='text' className='p-1' value={Url} onChange={(e)=>{setUrl(e.target.value)}}/>
                </div>
            </Form>
        </Modal>
        <Modal title={`You are booking slot ${activeId % 10} of studio ${Math.floor(activeId / 10)} for admin`} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: program === "" ? true : false }}>
            <Title>Enter the Reason</Title>
            <Form>
                <Input placeholder="eg: Higher Authority" onChange={(e) => setProgram(e.target.value)} />
            </Form>
        </Modal>
    </OuterContainer>
    )
}

export default Slot