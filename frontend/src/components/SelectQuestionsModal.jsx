import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { useSocket } from "@/context/socketContext";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { useEffect, useState } from "react";
import questionsFriendLevel from "../../../backend/friend-questions.json";
import questionCFLevel from "../../../backend/cf-questions.json";

const num = [5, 6, 7, 8, 9, 10];
const type = ["custom", "random", "friend", "close friend"];

const generateDefaultQuestions = () => {
  const questions = [];
  questionsFriendLevel.questions.map((el) => {
    questions.push({
      question: el.question,
      level: "friend",
      keyword: el.keyword,
    });
  });

  questionCFLevel.questions.map((el) => {
    questions.push({
      question: el.question,
      level: "close friend",
      keyword: el.keyword,
    });
  });

  return questions;
};

const questions = generateDefaultQuestions();

const SelectQuestionsModal = () => {
  const [numQuestion, setNumQuestion] = useState(5);
  const [questionsType, setQuestionsType] = useState("custom");
  const { questionsSelected, setQuestionsSelected } = useAuthStore();

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
    } else if (
      questionsType === "friend" ||
      questionsType === "close friend"
    ) {
      const copy = questions.filter((val) => val.level === questionsType);

      for (let i = 0; i < numQuestion; i++) {
        let ran = getRandomInt(copy.length);
        questionsList.push(copy[ran]);
        copy.splice(ran, 1);
      }
    } else if (questionsType === "custom") {
      questionsList = [];
    }

    setQuestionsSelected(questionsList);
  };

  useEffect(() => {
    selectQuestion();
  }, [numQuestion, questionsType]);

  const displayQuestions = () => {
    const handleClickQuestion = (index) => {
      const copy = [...questionsSelected];
      if (questionsSelected.includes(questions[index])) {
        const qIndex = questionsSelected.findIndex(
          (q) => q === questions[index]
        );
        copy.splice(qIndex, 1);
      } else {
        if (questionsSelected.length === numQuestion) return;
        copy.push(questions[index]);
      }

      setQuestionsSelected(copy);
    };

    return (
      <div
        className="w-full flex flex-row gap-2 overflow-y-auto"
        key="question-type-list"
      >
        {questions.map((el, i) => {
          if (
            (questionsType === "friend" ||
              questionsType === "close friend") &&
            questionsType !== el.level
          ) {
            return;
          }

          return (
            <div
              className={
                questionsSelected.includes(el)
                  ? "flex items-center justify-center text-2xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer text-nowrap"
                  : "flex items-center justify-center text-2xl lg:text-5xl text-mid-blue bg-white border-[1px] border-mid-blue font-mouse rounded-md z-10 cursor-pointer text-nowrap"
              }
              key={`${el.question + i}`}
              onClick={() => handleClickQuestion(i)}
            >
              <p className="m-2">{el.question}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-3/4 border border-[#8093F1] p-4 items-center justify-center gap-3 rounded-lg py-5 gap-4">
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
          className="h-full flex flex-row items-center justify-center gap-2 w-full"
          key="question-type-list"
        >
          {type.map((el) => (
            <div
              className={
                questionsType === el
                  ? "flex items-center justify-center w-full h-[100px] text-center py-2 text-2xl lg:text-5xl text-white bg-mid-blue font-mouse rounded-md z-10 cursor-pointer"
                  : "flex items-center justify-center w-full h-[100px] text-center py-2 text-2xl lg:text-5xl text-mid-blue bg-white border-[1px] border-mid-blue font-mouse rounded-md z-10 cursor-pointer"
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
          {`Selected ${questionsSelected.length} Questions`}
        </p>
        {displayQuestions()}
      </div>
      <PrimaryButton name="Save" action="selectQuestions" />
      <SecondaryButton name="Back" action="backToEnterName" />
    </div>
  );
};

export default SelectQuestionsModal;
