

interface ITextInput {
    onChange: (text:string) =>void;
}
const TextInput = ({onChange}:ITextInput) => {
    console.log("textInput rendered");

  return (
    <input type="text" className="border p-2 rounded-lg"
    onChange={(e)=>onChange(e.target.value)}
    />
  )
}

export default TextInput;
