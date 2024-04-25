import { Canvas } from "./_components/canvas";

interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const FormIdPage = ({ params }: FormIdPageProps) => {
  return <Canvas formId={params.formId} />;
};

export default FormIdPage;
