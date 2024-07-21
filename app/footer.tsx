export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div
      style={{
        marginTop: "40px",
        width: "100%",
        height: 50,
        backgroundColor: "skyblue",
        position: "fixed",
        bottom: 0,
        left: 0,
      }}
      className="d-flex justify-content-center align-item-center"
    >
      <p>copyright &copy; {year} GM</p>
    </div>
  );
};
