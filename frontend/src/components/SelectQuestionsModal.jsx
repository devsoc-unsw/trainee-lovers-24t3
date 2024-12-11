import PrimaryButton from '@/components/PrimaryButton';

const SelectQuestionsModal = () => {
  return (
    <div className='flex w-full justify-center items-center'>
      <PrimaryButton name='Select' action='selectQuestions'/>
    </div>
  )
}

export default SelectQuestionsModal;