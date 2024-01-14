export const data = [
    {
        "number": 1,
        "slots": [{ id: 11, time: "10:00-10:45", timingNo: 1 }, { id: 12, time: "11:00-11:45", timingNo: 2 }, { id: 13, time: "12:00-12:45", timingNo: 3 }, { id: 14, time: "02:00-02:45", timingNo: 4}, { id: 15, time: "03:00-03:45", timingNo: 5 }],
        "type": "theory",
        idx: 0,
        ids: [11,12,13,14,15]
    },
    {
        "number": 2,
        "slots": [{ id: 21, time: "10:00-10:45", timingNo: 1 }, { id: 22, time: "11:00-11:45", timingNo: 2 }, { id: 23, time: "12:00-12:45" , timingNo: 3}, { id: 24, time: "02:00-02:45", timingNo: 4 }, { id: 25, time: "03:00-03:45", timingNo: 5 }],
        "type": "theory",
        idx: 1,
        ids: [21,22,23,24,25]
    },
    {
        "number":3,
        "slots": [{ id: 31, time: "10:00-10:45", timingNo: 1 }, { id: 32, time: "11:00-11:45", timingNo: 2 }, { id: 33, time: "12:00-12:45", timingNo: 3 }, { id: 34, time: "02:00-02:45", timingNo: 4 }, { id: 35, time: "03:00-03:45", timingNo: 5 }],
        "type": "theory",
        idx: 2,
        ids: [31,32,33,34,35]
    },
    {
        "number": 4,
        "slots": [{ id: 41, time: "10:00-10:45", timingNo: 1 }, { id: 42, time: "11:00-11:45", timingNo: 2 }, { id: 43, time: "12:00-12:45", timingNo: 3 }, { id: 44, time: "02:00-02:45", timingNo: 4 }, { id: 45, time: "03:00-03:45", timingNo: 5 }],
        "type": "numerical",
        idx: 3,
        ids: [41,42,43,44,45]
    },
]

export const newData = [
    {
        studioNo: [1,2,3],
        "type": "theory",
        "slots": [{ids: [11,21,31], time: "10:00-10:45", timingNo: 1}, {ids: [12,22,32], time: "11:00-11:45",timingNo: 2}, {ids: [13,23,33], time: "12:00-12:45",timingNo: 3},{ids: [14,24,34], time: "02:00-02:45",timingNo: 4},{ids: [15,25,35], time: "03:00-3:45",timingNo: 5}]
    },
    {
        studioNo: [4],
        "type": "numerical",
        "slots": [{ids: [41], time: "10:00-10:45",timingNo: 1}, {ids: [42], time: "11:00-11:45",timingNo: 2}, {ids: [43], time: "12:00-12:45",timingNo: 3},{ids: [44], time: "02:00-02:45",timingNo: 4},{ids: [45], time: "03:00-3:45",timingNo: 5}]
    }
]


