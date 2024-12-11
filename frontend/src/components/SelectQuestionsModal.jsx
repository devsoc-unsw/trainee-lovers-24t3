import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { useEffect, useState } from "react";

const num = [5, 6, 7, 8, 9, 10];
const type = ["custom", "random", "friend level", "close friend level"];
const questions = [
  { question: "question1", level: "friend" },
  { question: "question2", level: "friend" },
  { question: "question3", level: "friend" },
  { question: "question4", level: "friend" },
  { question: "question5", level: "friend" },
  { question: "question6", level: "friend" },
  { question: "question7", level: "friend" },
  { question: "question8 long", level: "friend" },
  { question: "question9 but make it longer", level: "friend" },
  { question: "Whats ur name?", level: "friend" },
  { question: "question1", level: "close friend" },
  { question: "question2", level: "close friend" },
  { question: "question3", level: "close friend" },
  { question: "question4", level: "close friend" },
  { question: "question5", level: "close friend" },
  { question: "question6", level: "close friend" },
  { question: "question7", level: "close friend" },
  { question: "question8", level: "close friend" },
  { question: "question9", level: "close friend" },
  { question: "question10", level: "close friend" },
];

const SelectQuestionsModal = () => {
  const [numQuestion, setNumQuestion] = useState(5);
  const [questionsType, setQuestionsType] = useState("custom");
  const [questionList, setQuestionList] = useState([]);
  const [isEdit, setEdit] = useState(
    Array.from(Array(questions.length + 1).map((e) => false))
  );

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const selectQuestion = () => {
    let questionsList = [];
    if (questionsType === "random") {
      const copy = [...questions];

      for (let i = 0; i < numQuestion; i++) {
        let ran = getRandomInt(copy.length);
        questionsList.push(copy[ran]);
        copy.splice(ran, 1);
      }
    } else if (questionsType === "friend level") {
      const copy = questions.filter((val) => val.level === "friend");

      for (let i = 0; i < numQuestion; i++) {
        let ran = getRandomInt(copy.length);
        questionsList.push(copy[ran]);
        copy.splice(ran, 1);
      }
    } else if (questionsType === "close friend level") {
      const copy = questions.filter((val) => val.level === "close friend");

      for (let i = 0; i < numQuestion; i++) {
        let ran = getRandomInt(copy.length);
        questionsList.push(copy[ran]);
        copy.splice(ran, 1);
      }
    } else if (questionsType === "custom") {
      questionsList = [];
    }

    setQuestionList(questionsList);
  };

  useEffect(() => {
    selectQuestion();
  }, [numQuestion, questionsType]);

  const displayQuestions = () => {
    const handleClickQuestion = (index) => {
      const copy = [...questionList];
      if (questionList.includes(questions[index])) {
        const qIndex = questionList.findIndex((q) => q === questions[index]);
        copy.splice(qIndex, 1);
      } else {
        if (questionList.length === numQuestion) return;
        copy.push(questions[index]);
      }

      setQuestionList(copy);
    };

    const handleAddNewQuestion = (str) => {
      const copy = [...isEdit];
      copy[questions.length] = false;
      setEdit(copy);
      if (!str) return;
      questions.unshift({ question: str, level: undefined });
      handleClickQuestion(0);
    };

    const handleEditQuestion = (str, index) => {
      const copy = [...isEdit];
      copy[index] = false;
      setEdit(copy);
      if (!str) return;
      questions[index].question = str;
      handleClickQuestion(index);
    };

    return (
      <div
        className="w-full flex flex-row gap-2 overflow-auto"
        key="question-type-list"
      >
        {questionsType === "custom" ? (
          <div
            className="flex items-center justify-center text-2xl lg:text-5xl text-white bg-blue-900 font-mouse rounded-md z-10 cursor-pointer text-nowrap"
            onClick={() => {
              const copy = [...isEdit];
              copy[questions.length] = true;
              setEdit(copy);
            }}
            onBlur={() => {
              const copy = [...isEdit];
              copy[questions.length] = false;
              setEdit(copy);
            }}
          >
            {isEdit[questions.length] ? (
              <input
                className="flex items-center justify-center p-2 text-2xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer text-nowrap"
                type="text"
                placeholder="insert your question..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddNewQuestion(e.target.value);
                }}
              ></input>
            ) : (
              <p className="m-2">+ Add Question</p>
            )}
          </div>
        ) : (
          ""
        )}
        {questions.map((el, i) => (
          <div
            className={
              questionList.includes(el)
                ? "flex items-center justify-center text-2xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer text-nowrap"
                : "flex items-center justify-center text-2xl lg:text-5xl text-mid-blue bg-white border-[1px] border-mid-blue font-mouse rounded-md z-10 cursor-pointer text-nowrap"
            }
            key={`${el.question + i}`}
            onClick={() => handleClickQuestion(i)}
            onDoubleClick={() => {
              const copy = [...isEdit];
              copy[i] = true;
              setEdit(copy);
            }}
            onBlur={() => {
              const copy = [...isEdit];
              copy[i] = false;
              setEdit(copy);
            }}
          >
            {isEdit[i] ? (
              <input
                className="flex items-center justify-center p-2 text-2xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer text-nowrap"
                type="text"
                placeholder="insert your question here..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditQuestion(e.target.value, i);
                }}
              ></input>
            ) : (
              <p className="m-2">{el.question}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-3/4 border border-[#8093F1] p-4 items-center justify-center gap-3 rounded-lg py-5 gap-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <p className="text-3xl text-[#4154AF] text-center">
          Select the number of question(s)
        </p>
        <div
          className="flex items-center justify-center gap-2 w-full"
          key="num-question-list"
        >
          {num.map((i) => (
            <div
              className={
                numQuestion === i
                  ? "flex items-center justify-center w-[30px] h-16 py-2 text-3xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer"
                  : "flex items-center justify-center w-[30px] h-16 py-2 text-3xl lg:text-5xl text-mid-blue bg-white border-[1px] border-mid-blue font-mouse rounded-md z-10 cursor-pointer"
              }
              key={i}
              onClick={() => {
                setNumQuestion(i);
              }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-3xl text-[#4154AF] text-center">
          Select Question Level
        </p>
        <div
          className="flex flex-row items-center justify-center gap-2 w-full"
          key="question-type-list"
        >
          {type.map((el) => (
            <div
              className={
                questionsType === el
                  ? "flex items-center justify-center w-full h-full text-center py-2 text-2xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer"
                  : "flex items-center justify-center w-full h-full text-center py-2 text-2xl lg:text-5xl text-mid-blue bg-white border-[1px] border-mid-blue font-mouse rounded-md z-10 cursor-pointer"
              }
              onClick={() => {
                selectQuestion();
                setQuestionsType(el);
              }}
              key={el}
            >
              {el}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 flex-wrap">
        <p className="w-full text-3xl text-[#4154AF] text-center overflow-auto">
          {`Selected ${questionList.length} Questions`}
        </p>
        {displayQuestions()}
      </div>
      <PrimaryButton name="Save" action="selectQuestions" />
      <SecondaryButton name="Back" action="backToEnterName" />
    </div>
  );
};

export default SelectQuestionsModal;
