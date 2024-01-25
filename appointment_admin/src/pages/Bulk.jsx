import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { userRequest } from "../requestMethods";
import { DatePicker, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { customAlphabet } from "nanoid";
import Papa from "papaparse";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import BulkCSVTemplate from "../assets/bulkbookstudiotemplate.csv";
dayjs.extend(customParseFormat);
const nanoid = customAlphabet("1234567890abcdef", 10);

const OuterContainer = styled.div`
  display: flex;
`;
const Container = styled.div`
  width: 100%;
`;
const InnerContainer = styled.div`
  display: flex;
`;
const H3 = styled.h2`
  margin-top: 40px;
`;
const Wrapper = styled.div`
  /* background-color: black;  */
  margin-top: 40px;
  border-radius: 4px;
  padding: 60px 40px 60px 40px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;
const Studios = styled.div`
  display: flex;
`;
const Span = styled.span`
  color: red;
  margin-top: 20px;
`;
const RealValidDataOl = [
  "Sno",
  "Studio",
  "TimingNo",
  "TeacherEmail",
  "Semester",
  "Program",
  "Course",
];
const Bulk = () => {
  const [loading, setLoading] = useState(false);
  const [selectedfile, SetSelectedFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDataValid, setIsDataValid] = useState(false);
  const [dateString, setDateString] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(true);

  const checkDataValid = (dataArray) => {
    const isEveryValuePresent = RealValidDataOl.every((value) =>
      dataArray.includes(value)
    );
    if (isEveryValuePresent === false) {
      setIsDataValid(false);
      handleClear();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please upload a file which have headears with same naming convention as given below!",
      });
    } else {
      setIsDataValid(true);
    }
  };

  const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const InputChange = (e) => {
    setUploading(true);
    // --For Single File Input
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      SetSelectedFile({
        id: nanoid(5),
        filename: e.target.files[0].name,
        filetype: e.target.files[0].type,
        fileimage: reader.result,
        datetime: e.target.files[0].lastModifiedDate.toLocaleString("en-IN"),
        filesize: filesizes(e.target.files[0].size),
        realFile: e.target.files[0],
      });
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(file);
      Papa.parse(e.target.files[0], {
        header: false,
        complete: (results) => {  
          checkDataValid(results.data[0]);
        },
      });
      setUploading(false);
    }
  };

  const FileUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    if (selectedfile !== "") {
      const formData = new FormData();
      formData.append("uploadField", selectedfile.realFile);
        formData.append('date', dateString)
      try {
        const res = await userRequest.post("/booking/bulk/excel", formData);
        if (res.data) {
          setUploading(false);
          SetSelectedFile("");
          Swal.fire("So fast!", "All your bookings are made!", "success");
        }
      } catch (error) {
        console.log(error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong, try again later!",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please check the file you provided!",
      });
    }
  };

  const handleClear = () => {
    SetSelectedFile("");
    setUploading(false);
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 110,
        alignSelf: "center",
        marginTop: "160px",
      }}
      spin
    />
  );
  const onChange = (date, dateString) => {
    setDateString(dateString);
    // slotStatuses(dispatch, dateString)
  };
  const disabledDate = (current) => {
    // Check if the date is a Sunday.
    const day = current.weekday();
    if (day === 0) {
      return true;
    }

    // Get today's date
    const today = dayjs();

    // Check if the date is before today (including today)
    if (current.isAfter(today, "day") || current.isSame(today, "day")) {
      return true;
    }

    // The date is not disabled.
    return false;
  };
  console.log(dateString)
  return (
    <OuterContainer>
      <Sidebar />
      <Container>
        <Navbar />
        <InnerContainer>
          <div className="m-3">
            <DatePicker
              onChange={onChange}
              open={datePickerOpen}
              style={{ width: "288px", fontSize: "28px" }}
              size="large"
              disabledDate={disabledDate}
            />
          </div>
          <div className="p-4 m-2 w-25">
            <a
              href={BulkCSVTemplate}
              download="TEMPLATE-PDF-document"
              target="_blank"
              rel="noreferrer"
            >
              <button className="btn btn-link">Download .csv file template</button>
            </a>
          </div>
          <Spin indicator={antIcon} spinning={uploading} size="large">
            <div className="card m-4 p-5">
              <div>
                <form onSubmit={FileUploadSubmit}>
                  <div className="mb-3">
                    <label for="formFile" className="form-label mb-4">
                      Upload file{" "}
                      <span className="text-danger">
                        *only csv file supported
                      </span>
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      id="fileupload"
                      onChange={InputChange}
                      accept=".csv"
                    />
                  </div>
                  <div>
                    <div>
                      {selectedfile !== "" ? (
                        <div className="file-atc-box">
                          <div className="file-detail">
                            <p className="d-flex flex-column">
                              <span>{selectedfile.filename}</span>
                              <span>Size : {selectedfile.filesize}</span>
                              <span className="ml-2">
                                Modified Time : {selectedfile.datetime}
                              </span>
                            </p>
                          </div>
                          <div className="d-flex justify-content-around">
                            <div className="kb-buttons-box">
                              <button
                                className="btn btn-danger"
                                onClick={handleClear}
                              >
                                clear
                              </button>
                            </div>
                            <div className="kb-buttons-box">
                              <button
                                type="submit"
                                className="btn btn-primary form-submit px-5"
                                disabled={!isDataValid || !dateString.length}
                              >
                                Bulk Book
                              </button>
                            </div>
                          </div>
                          {!dateString.length && <span className="text-danger w-100 text-center d-block mt-2">*Please select date</span>}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {selectedfile !== "" ? <></> : ""}
                  </div>
                </form>
              </div>
            </div>
          </Spin>
        </InnerContainer>
      </Container>
    </OuterContainer>
  );
};

export default Bulk;
