"use client";
import { useEffect, useState } from "react";
import { TChild, TIncident } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import Error from "../Error";

export default function Home() {
  const [incidents, setIncidents] = useState<TIncident[]>([]);
  const [students, setStudents] = useState<TChild[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<TChild[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<TChild[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<
    "Low" | "Medium" | "High"
  >("Low");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("warning");
  const [errorIncidents, setErrorIncidents] = useState("");
  const [errorStudents, setErrorStudents] = useState("");
  const fetchIncidents = () => {
    axios
      .get(`/api/incidents`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setIncidents((prev) => [...prev, ...res.data]);
      })
      .catch((err) => {
        console.log(err);
        setErrorIncidents(err.response.data);
      });
  };
  const fetchStudents = () => {
    axios
      .get(`/api/students?grade=${filterValue}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        setErrorStudents(err.response.data);
      });
  };
  useEffect(() => {
    console.log(filterValue == "");
    if (filterValue === "") setFilteredStudents([]);
    else setFilteredStudents(students);
  }, [students]);
  useEffect(() => {
    fetchStudents();
    fetchIncidents();
  }, []);
  useEffect(() => {
    setFilteredStudents([]);
    setErrorStudents("");
    fetchStudents();
  }, [filterValue]);
  return (
    <div className="flex justify-between max-[550px]:flex-col">
      <div className="min-[550px]:w-3/4 w-screen flex flex-col items-center px-10 mt-20">
        <h1 className="text-center text-[1.2rem] font-semibold">Incidents</h1>
        <div className="border mt-20 mb-10 flex items-center justify-center flex-col gap-2 p-10 rounded-md border-(--borderColor) max-w-175 w-full">
          {selectedStudents.length > 0 && (
            <div className="flex items-center mt-20 flex-col">
              <div className="flex max-[450px]:flex-col gap-4">
                {selectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex gap-3 border border-(--brandColor) bg-(--brandColorOpaque) px-4 rounded-sm"
                  >
                    <h1>{student.name}</h1>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      width={20}
                      onClick={() => {
                        setSelectedStudents(
                          selectedStudents.filter((s) => s.id !== student.id),
                        );
                      }}
                    >
                      <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center mt-10 justify-center flex-col gap-2">
            <div className="flex gap-6 flex-col">
              <select
                onChange={(e) => {
                  setFilterValue(e.target.value);
                }}
                className="input"
                value={filterValue}
              >
                <option value="">Select Grade</option>
                <option value="06">6</option>
                <option value="07">7</option>
                <option value="08">8</option>
                <option value="09">9</option>
                <option value="soph">10</option>
                <option value="jun">11</option>
                <option value="sen">12</option>
              </select>
            </div>
          </div>
          <div className="max-h-30 overflow-y-auto">
            {filteredStudents.map((student) => (
              <div key={student.id}>
                <h1
                  onClick={() => {
                    setSelectedStudents((prev) => {
                      const unfiltered = [...prev, student];

                      const filtered = new Map(
                        unfiltered.map((s) => [s.id, s]),
                      ).values();

                      return Array.from(filtered);
                    });
                  }}
                >
                  {student.name}
                </h1>
              </div>
            ))}
          </div>
          {filterValue == "" && filteredStudents.length == 0 ? (
            <Error
              error={"Please select a grade to coninue"}
              className="text-center"
            />
          ) : errorStudents ? (
            <Error error={errorStudents} className="text-center" />
          ) : null}
        </div>
        <form
          className="flex flex-col gap-2 items-center justify-center w-5/6 max-[450px]:w-full max-w-175 p-15 rounded-md min-[450px]:border border-(--borderColor)"
          onSubmit={(e) => {
            e.preventDefault();
            alert(category);
            axios
              .post(
                "/api/incidents",
                {
                  title,
                  description,
                  category,
                  severity: selectedSeverity,
                  childrenId: selectedStudents.map((s) => s.id),
                },
                {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                },
              )
              .then((res) => {
                alert("Incident reported successfully");
                setTitle("");
                setDescription("");
                setCategory("");
                setSelectedStudents([]);
                setIncidents((prev) => [...res.data, ...prev]);
              })
              .catch((err) => {
                alert(err.response.data);
              });
          }}
        >
          <h1 className="text-[1.2rem] font-semibold">Report Incident</h1>
          <div className="flex flex-col">
            <label htmlFor="title" className="text-[1.1rem]">
              Title
            </label>
            <input
              type="text"
              className="input"
              placeholder="Brief summary of the incident"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description" className="text-[1.1rem]">
              Description
            </label>
            <textarea
              className="input"
              placeholder="Describe the incident in detail"
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>
          <select
            id="category"
            className="input"
            onChange={(e) => {
              setCategory(e.target.value);
              alert(e.target.value);
            }}
          >
            <option value="">Select a Category</option>
            <option value="warning">Warning</option>
            <option value="information">Information</option>
            <option value="urgent">Urgent</option>
            <option value="positive">Positive</option>
          </select>
          <div className="w-full">
            <h1 className="text-[1.1rem] text-center">Severity</h1>
            <div className="flex w-full gap-3">
              <button
                className={`border              ${
                  selectedSeverity === "Low"
                    ? "border-(--brandColor) text-(--brandColor) bg-(--brandColorOpaque)"
                    : "border-(--borderColor)"
                } p-2 rounded-md w-1/3`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSeverity("Low");
                }}
              >
                Low
              </button>
              <button
                className={`border              ${
                  selectedSeverity === "Medium"
                    ? "border-(--warningColor) text-(--warningColor) bg-(--warningColorOpaque)"
                    : "border-(--borderColor)"
                } p-2 rounded-md w-1/3 flex items-center justify-center flex-wrap`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSeverity("Medium");
                }}
              >
                Medium
              </button>
              <button
                className={`border
                ${
                  selectedSeverity === "High"
                    ? "border-(--dangerColor) text-(--dangerColor) bg-(--dangerColorOpaque)"
                    : "border-(--borderColor)"
                } p-2 rounded-md w-1/3 min-h-20`}
                onClick={(e) => {
                  setSelectedSeverity("High");
                  e.preventDefault();
                }}
              >
                High
              </button>
            </div>
          </div>
          <button className="button">Send</button>
        </form>
      </div>
      <div className="min-[550px]:border border-(--borderColor)  py-4 min-[550px]:px-4 min-[550px]:w-1/4 w-full max-[550px]:px-8 mt-20 mr-15">
        <h1 className="text-[1.2rem] text-center font-semibold">
          Recent Incidents
        </h1>
        <div className="flex gap-2 flex-col">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="border border-(--borderColor) px-4"
            >
              <div className="flex justify-between w-full">
                <h1 className="text-[1.1rem] font-semibold">
                  {incident.title}
                </h1>
                <h1>Severity: {incident.severity}</h1>
              </div>
              <div>
                <h1>
                  {console.log(incident.Child) as any}
                  {incident.Child.name.toLocaleLowerCase()} -{" "}
                  {incident.Child.grade}
                </h1>
              </div>
            </div>
          ))}
        </div>
        {errorIncidents && (
          <Error error={errorIncidents} className="text-center mt-20" />
        )}
      </div>
    </div>
  );
}
