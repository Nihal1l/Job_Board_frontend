const ProfileButtons = ({ isEditing, setIsEditing, isSubmitting }) => {
  return (
    <div className="flex justify-end gap-2 mt-6">
      {!isEditing ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(true);
          }}
        >
          Edit Profile
        </button>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileButtons;
