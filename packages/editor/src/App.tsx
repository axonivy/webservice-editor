import { Editor, type WebServiceEditorProps } from './editor/Editor';

function App(props: WebServiceEditorProps) {
  return <Editor {...props} />;
}

export default App;
