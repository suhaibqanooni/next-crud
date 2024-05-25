interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
}
export const InputField = ({
  label,
  name,
  value,
  onChange,
  type,
}: InputFieldProps) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        className="form-control"
        type={type || "text"}
        name={name}
        value={value}
        placeholder={label}
        onChange={onChange}
      />
    </div>
  );
};

interface InputSelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}
// export const InputSelectField = ({
//   label,
//   name,
//   value,
//   onChange,
//   options,
// }: InputSelectFieldProps) => {
//   return (
//     <>
//       <label>{label}</label>

//       <select
//         className="form-control"
//         name={name}
//         value={value}
//         onChange={onChange}
//       >
//         <option value="">Select Category</option>
//         {options.map((op, i) => (
//           <option value={op} key={i + 1}>
//             {op}
//           </option>
//         ))}
//       </select>
//     </>
//   );
// };
export const InputSelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}: InputSelectFieldProps) => {
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
        {options.map((op: any, i) => (
          <option value={op.value} key={i + 1}>
            {op.label}
          </option>
        ))}
      </select>
    </>
  );
};
