import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import apiClient from "../services/api-client";
import ErroAlert from "../components/ErroAlert";
import { useState } from "react";

const PostJob = () => {
  const { authTokens, errorMsg } = useAuthContext();
  const [successMsg, setSuccessMsg] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setLocalError("");
    setSuccessMsg("");
    try {
      const response = await apiClient.post("/jobs/", data, {
        headers: {
          Authorization: `JWT ${authTokens?.access}`,
        },
      });
      if (response.status === 201 || response.status === 200) {
        setSuccessMsg("Job posted successfully!");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      console.error("Failed to post job", error);
      if (error.response && error.response.data) {
        setLocalError(Object.values(error.response.data).flat().join(" "));
      } else {
        setLocalError("Failed to post job. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          {(errorMsg || localError) && <ErroAlert error={errorMsg || localError} />}
          {successMsg && (
            <div role="alert" className="alert alert-success mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{successMsg}</span>
            </div>
          )}

          <h2 className="card-title text-3xl font-bold text-center justify-center">Post a New Job</h2>
          <p className="text-base-content/70 text-center mb-6">
            Fill in the details below to post a new job opening.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control col-span-1 md:col-span-2">
              <label className="label" htmlFor="title">
                <span className="label-text font-semibold">Job Title</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Software Engineer"
                className="input input-bordered w-full"
                {...register("title", { required: "Job Title is Required" })}
              />
              {errors.title && <span className="label-text-alt text-error">{errors.title.message}</span>}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="category">
                <span className="label-text font-semibold">Category</span>
              </label>
              <input
                id="category"
                type="text"
                placeholder="Technology"
                className="input input-bordered w-full"
                {...register("category", { required: "Category is Required" })}
              />
              {errors.category && <span className="label-text-alt text-error">{errors.category.message}</span>}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="company_name">
                <span className="label-text font-semibold">Company Name</span>
              </label>
              <input
                id="company_name"
                type="text"
                placeholder="TechCorp"
                className="input input-bordered w-full"
                {...register("company_name", { required: "Company Name is Required" })}
              />
              {errors.company_name && <span className="label-text-alt text-error">{errors.company_name.message}</span>}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="location">
                <span className="label-text font-semibold">Location</span>
              </label>
              <input
                id="location"
                type="text"
                placeholder="Remote / New York, NY"
                className="input input-bordered w-full"
                {...register("location", { required: "Location is Required" })}
              />
              {errors.location && <span className="label-text-alt text-error">{errors.location.message}</span>}
            </div>

            <div className="form-control col-span-1 md:col-span-2">
              <label className="label" htmlFor="description">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                id="description"
                className="textarea textarea-bordered h-32 w-full"
                placeholder="Provide a detailed job description..."
                {...register("description", { required: "Description is Required" })}
              ></textarea>
              {errors.description && <span className="label-text-alt text-error">{errors.description.message}</span>}
            </div>

            <div className="form-control col-span-1 md:col-span-2">
              <label className="label" htmlFor="requirements">
                <span className="label-text font-semibold">Requirements</span>
              </label>
              <textarea
                id="requirements"
                className="textarea textarea-bordered h-24 w-full"
                placeholder="List the job requirements..."
                {...register("requirements", { required: "Requirements are Required" })}
              ></textarea>
              {errors.requirements && <span className="label-text-alt text-error">{errors.requirements.message}</span>}
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <button 
                type="submit" 
                className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
