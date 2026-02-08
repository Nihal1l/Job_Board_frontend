const PasswordChangeForm = ({ errors, register, isEditing, watch }) => {
  if (!isEditing) return null;

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-bold mb-4">Change Password</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Current Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered"
            {...register("current_password")}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            className="input input-bordered"
            {...register("new_password", {
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters"
              }
            })}
          />
          {errors.new_password && (
            <span className="text-error text-sm">
              {errors.new_password.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
