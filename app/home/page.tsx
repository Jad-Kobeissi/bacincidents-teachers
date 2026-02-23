"use client";
import { useEffect, useState } from "react";
import { TChild, TIncident } from "../types";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import Error from "../Error";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const fetchIncidents = () => {
    axios
      .get(`/api/incidents`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setIncidents((prev) => {
          const unfiltered = [...res.data, ...prev];

          const filtered = new Map(unfiltered.map((i) => [i.id, i])).values();

          return Array.from(filtered);
        });
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
    <div>
      <nav className="flex justify-between px-6 py-2">
        <div className="flex flex-col">
          <h1 className="text-[1.2rem] font-semibold">TransParent</h1>
          <p className="text-(--secondaryText)">Teacher dashboard</p>
        </div>
        <div>
          <div
            onClick={() => {
              deleteCookie("token");
              deleteCookie("BACToken");
              router.push("/");
            }}
          >
            <svg
              width={40}
              viewBox="0 0 640 640"
              fill="currentColor"
              className="fill-[#1f1f10]"
            >
              <path d="M224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160zM566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L438.6 169.3C426.1 156.8 405.8 156.8 393.3 169.3C380.8 181.8 380.8 202.1 393.3 214.6L466.7 288L256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L466.7 352L393.3 425.4C380.8 437.9 380.8 458.2 393.3 470.7C405.8 483.2 426.1 483.2 438.6 470.7L566.6 342.7z" />
            </svg>
          </div>
        </div>
      </nav>
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
                      className="flex gap-3 border border-(--borderColor)  px-4 rounded-sm"
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
                <div
                  key={student.id}
                  className="border border-(--borderColor) px-8 rounded-sm cursor-pointer"
                >
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
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
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
          <div className="flex gap-4 flex-col">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={`border border-(--borderColor) rounded-full px-6 ${incident.category.toString() === "Warning" ? "bg-(--warningColorOpaque) border-(--warningColor)" : incident.category.toString() === "Information" ? "bg-(--brandColorOpaque) border-(--brandColor)" : incident.category.toString() === "Urgent" ? "bg-(--dangerColorOpaque) border-(--dangerColor)" : incident.category.toString() === "Positive" ? "bg-(--positiveColorOpaque) border-(--positiveColor)" : ""}`}
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
    </div>
  );
}
