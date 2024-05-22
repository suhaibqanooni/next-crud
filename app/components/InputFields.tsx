export const InputField = ({ label, name, value, onChange, type }) => {
  return (
    <>
      <label>{label}</label>
      <input
        className="form-control"
        type={type || "text"}
        name={name}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export const InputSelectField = ({ label, name, value, onChange, options }) => {
  return (
    <>
      <label>{label}</label>

      <select
        className="form-control"
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">Select Category</option>
        {options.map((op) => (
          <option value={op}>{op}</option>
        ))}
      </select>
    </>
  );
};
