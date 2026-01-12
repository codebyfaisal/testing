import React from "react";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import { Button, Card, FadeIn } from "@/components";
import { useNavigate } from "react-router-dom";

const JobList = ({ jobs, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <FadeIn className="grid grid-cols-1 gap-4">
      {jobs?.map((job) => (
        <Card
          key={job._id}
          className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${
                  job.status === "Open"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {job.status}
              </span>
            </div>
            <div className="text-muted-foreground text-sm flex gap-4">
              <span>{job.type}</span>
              <span>&bull;</span>
              <span>{job.location}</span>
              {job.salary && (
                <>
                  <span>&bull;</span>
                  <span>
                    {job.salary.min} - {job.salary.max} {job.salary.currency}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Button
              uiType="secondary"
              icon={<FaUsers />}
              label="Applications"
              onClick={() => navigate(`/applications?jobId=${job._id}`)}
              title="View Applications"
              className="mr-2"
            />
            <Button
              onClick={() => onEdit(job)}
              uiType="action"
              icon={<FaEdit />}
              title="Edit"
            />
            <Button
              onClick={() => onDelete(job._id)}
              uiType="action"
              icon={<FaTrash />}
              title="Delete"
            />
          </div>
        </Card>
      ))}
    </FadeIn>
  );
};

export default JobList;
