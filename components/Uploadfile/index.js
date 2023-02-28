import Input from "./input";

export default function Uploadfile() {
  const onFileChange = (files) => {
    console.log(files[0]);
  };
  return (
    <div>
      <Input onFileChange={(files) => onFileChange(files)} />
    </div>
  );
}
