"use client";
import Nav from "@/app/Nav";
import { TIncident } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import moment from "moment";
import React, { use, useEffect, useState } from "react";

export default function Incident({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [incident, setIncident] = useState<TIncident | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchIncident = () => {
    setLoading(true);
    axios
      .get(`/api/incidents/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setIncident(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchIncident();
  }, []);
  return (
    <>
      <Nav />
      <div className="absolute top-0 w-screen">
        <div className="flex flex-col gap-2 items-center justify-center h-screen">
          <h1 className="text-[1.2rem] font-semibold">{incident?.title}</h1>
          <p className="text-(--secondaryText)">{incident?.description}</p>
          <div className="flex gap-2 items-center">
            <div className="border border-(--borderColor) px-4 rounded-full">
              <h1 className="capitalize">
                {incident?.Child.name.toLowerCase()}
              </h1>
            </div>
            <div
              className={`border ${incident?.severity.toString() == "Low" ? "border-(--positiveColorOpaque) bg-(--positiveColorOpaque)" : incident?.severity.toString() == "Medium" ? "border-(--warningColorOpaque) bg-(--warningColorOpaque)" : incident?.severity.toString() == "High" ? "border-(--dangerColorOpaque) bg-(--dangerColorOpaque)" : "border-(--borderColor) bg-(--backgroundColor)"} px-4 rounded-full`}
            >
              <h1>{incident?.severity}</h1>
            </div>
            <div
              className={`border ${incident?.category.toString() == "Warning" ? "border-(--warningColorOpaque) bg-(--warningColorOpaque)" : incident?.category.toString() == "Information" ? "border-(--brandColorOpaque) bg-(--brandColorOpaque)" : incident?.category.toString() == "Positive" ? "border-(--positiveColorOpaque) bg-(--positiveColorOpaque)" : incident?.category.toString() == "Urgent" ? "border-(--dangerColorOpaque) bg-(--dangerColorOpaque)" : "border-(--borderColor) bg-(--backgroundColor)"} px-4 rounded-full`}
            >
              <h1>{incident?.category}</h1>
            </div>
          </div>
          <h1>{moment(incident?.occurredAt).fromNow()}</h1>
        </div>
      </div>
    </>
  );
}
