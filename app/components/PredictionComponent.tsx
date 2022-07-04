interface PredictionComponentProps {
  prediction: number | null;
}

const PredictionComponent: React.FC<PredictionComponentProps> = ({
  prediction,
}) => {
  return (
    <>
      <div className="lg:w-1/4 md:1/2 h-50v h-overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:shadow-lg border-solid border-2 border-gray-100 p-5 flex justify-center">
        <div>
          <p className="mt-5 text-center">Prediction Here!</p>
          <div className="prediction mt-5">
            <div className="min-h-full flex items-center">
              <div className="min-w-full text-9xl text-center">
                {prediction ? <p>{prediction}</p> : <p>?</p>}
              </div>
            </div>
          </div>
          <div className="flex mt-5 justify-center">
            <button className="rounded-lg px-3 py-2 border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline">
              Wrong 😞
            </button>

            <button className="rounded-lg px-3 py-2 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline">
              Correct 😃
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PredictionComponent;
