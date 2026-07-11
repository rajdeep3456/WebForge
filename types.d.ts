type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

type Messages = {
  role: string;
  content: string;
};
