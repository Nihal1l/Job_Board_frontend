const ProfileForm = ({ register, errors, isEditing }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">First Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          disabled={!isEditing}
          {...register("first_name", { required: "First Name is required" })}
        />
        {errors.first_name && (
          <span className="text-error text-sm">
            {errors.first_name.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Last Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          disabled={!isEditing}
          {...register("last_name", { required: "Last Name is required" })}
        />
        {errors.last_name && (
          <span className="text-error text-sm">{errors.last_name.message}</span>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          disabled
          {...register("email")}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Phone Number</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          disabled={!isEditing}
          {...register("phone_number")}
        />
      </div>
      
      <div className="form-control md:col-span-2">
        <label className="label">
          <span className="label-text">Address</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          disabled={!isEditing}
          {...register("address")}
        ></textarea>
      </div>
    </div>
  );
};

export default ProfileForm;
