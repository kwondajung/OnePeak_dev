"use client";

import { useState } from "react";
import Image from "next/image";
import noActiveCheck from "@/assets/noactive-check.svg";
import activeCheck from "@/assets/active-check.svg";
import { Typography } from "../ui/typography";
import { useUserWrongAnswers } from "@/hooks/useUserWrongAnswers";
import { useGrammarQuestions } from "@/hooks/useGrammarQuestions";
import { useUpdateIsReviewed } from "@/hooks/useUpdateIsReviewed";

const GrammarList = ({ userId }: { userId: string }) => {
  const [isReviewed, setIsReviewed] = useState<"미완료" | "완료">("미완료");

  // 사용자의 틀린문제 데이터를 가져오는 커스텀훅
  const { data: userAnswers, error: userAnswersError, isLoading: userAnswersLoading } = useUserWrongAnswers(userId);

  // 문법문제 데이터를 가져오는 커스텀훅
  const { data: questions, error: questionsError, isLoading: questionsLoading } = useGrammarQuestions();

  // 틀린 문제를 '완료' 또는 '미완료'로 상태를 변경하는 훅
  const { mutate: toggleIsReviewed } = useUpdateIsReviewed(userId);

  // 데이터 로딩 중 표시
  if (userAnswersLoading || questionsLoading) return <p>로딩중입니다...</p>;

  // 데이터 로드 오류 처리
  if (userAnswersError) return <p>{userAnswersError.message}</p>;
  if (questionsError) return <p>{questionsError.message}</p>;

  // 현재 상태("미완료" 또는 "완료")에 따라 userAnswers 필터링
  const filteredAnswers = userAnswers
    ?.filter((answer) => (isReviewed === "미완료" ? !answer.is_reviewed : answer.is_reviewed))
    .map((answer) => {
      const matchedQuestion = questions?.find((question) => question.id === answer.question_id);
      return matchedQuestion ? { ...matchedQuestion, answerId: answer.id, isReviewed: answer.is_reviewed } : null;
    })
    .filter((item) => item !== null);

  return (
    <div className="flex flex-col gap-4 md:gap-[30px] md:px-3">
      <div className="bg-gray-900 flex rounded-[22px] w-[343px] mx-auto md:ml-1 h-[46px] p-1 justify-center items-center md:justify-start md:bg-transparent md:gap-[10px]">
        {/* 상태 전환 버튼 (미완료 / 완료) */}
        <button
          className={`${
            isReviewed === "미완료"
              ? "w-[163px] md:w-[90px] h-[38px] rounded-[22px] justify-center items-center inline-flex bg-primary-800 text-primary-400"
              : "bg-gray-900 text-gray-600 w-[163px] md:w-[90px] h-[38px] rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("미완료")}
        >
          <Typography size={16} weight="medium" className="md:text-2xl md:font-bold">
            미완료
          </Typography>
        </button>
        <button
          className={`${
            isReviewed === "완료"
              ? "w-[163px] md:w-[90px] h-[38px] rounded-[22px] justify-center items-center inline-flex bg-primary-800 text-primary-400"
              : "bg-gray-900 text-gray-600 w-[163px] md:w-[90px] h-[38px] rounded-[22px] justify-center items-center inline-flex"
          }`}
          onClick={() => setIsReviewed("완료")}
        >
          <Typography size={16} weight="medium" className="md:text-2xl md:font-bold">
            완료
          </Typography>
        </button>
      </div>
      <div
        className={`overflow-auto md:h-[543px] md:flex md:flex-col md:gap-5 md:p-[30px] md:border-none md:rounded-xl ${
          isReviewed === "미완료" ? "md:bg-gray-900" : "md:bg-primary-900"
        }`}
      >
        {/* Content here */}
        <div className="hidden md:flex md:flex-col">
          <Typography size={22} className="md:font-bold">{`${isReviewed === "미완료" ? "미완료" : "완료"}`}</Typography>
        </div>
        <div className="flex flex-col gap-[10px] md:gap-[20px] md:max-h-[411px] overflow-y-auto">
          {/* 필터링된 오답 데이터를 순회하며 UI를 생성 */}
          {filteredAnswers?.map((question, index) => (
            <div
              key={index}
              className={`w-full h-auto mb-[10px] px-5 py-[18px] md:py-0 justify-center bg-white rounded-[10px] shadow-review ${
                question!.isReviewed ? "border border-primary-500" : ""
              }`}
            >
              {/* 상태 변경 버튼 */}
              <button
                onClick={() =>
                  toggleIsReviewed({
                    answerId: question!.answerId, // 답변 ID를 전달
                    currentReviewed: question!.isReviewed // 현재 상태를 전달
                  })
                }
                className="w-full flex flex-row items-center justify-between"
              >
                <div className="grow px-[20px] md:px-0">
                  <div className="flex flex-col gap-[10px] md:gap-0">
                    <Typography size={16} weight="bold" className="text-left md:my-[10px] md:text-3xl">
                      {question?.content.split("_____").map((part, index) => (
                        <span key={index}>
                          {part}
                          {index < question.content.split("____").length - 1 && (
                            <span className="text-red-500 inline">{question.answer}</span>
                          )}
                        </span>
                      ))}
                    </Typography>
                    <div className="border border-gray-900" />
                    <Typography
                      size={14}
                      weight="medium"
                      className="text-left text-gray-300 md:mt-[10px] md:mb-5 md:text-xl"
                    >
                      {question?.reason}
                    </Typography>
                  </div>
                </div>
                {/* 상태 아이콘 표시 */}
                <div className="flex-none">
                  <Image
                    src={question!.isReviewed ? activeCheck : noActiveCheck}
                    alt="status icon"
                    className="w-6 h-6"
                  />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrammarList;
