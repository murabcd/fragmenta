import { Suspense } from "react";

import { Canvas } from "./_components/canvas";

import Loading from "./loading";

interface FormIdPageProps {
  params: {
    formId: string;
  };
}

const FormIdPage = ({ params }: FormIdPageProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Canvas formId={params.formId} />
    </Suspense>
  );
};

export default FormIdPage;
