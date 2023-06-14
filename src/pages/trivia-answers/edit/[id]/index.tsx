import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getTriviaAnswerById, updateTriviaAnswerById } from 'apiSdk/trivia-answers';
import { Error } from 'components/error';
import { triviaAnswerValidationSchema } from 'validationSchema/trivia-answers';
import { TriviaAnswerInterface } from 'interfaces/trivia-answer';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { TriviaQuestionInterface } from 'interfaces/trivia-question';
import { getTriviaQuestions } from 'apiSdk/trivia-questions';

function TriviaAnswerEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<TriviaAnswerInterface>(
    () => (id ? `/trivia-answers/${id}` : null),
    () => getTriviaAnswerById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TriviaAnswerInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateTriviaAnswerById(id, values);
      mutate(updated);
      resetForm();
      router.push('/trivia-answers');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<TriviaAnswerInterface>({
    initialValues: data,
    validationSchema: triviaAnswerValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Trivia Answer
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="answer" mb="4" isInvalid={!!formik.errors?.answer}>
              <FormLabel>Answer</FormLabel>
              <Input type="text" name="answer" value={formik.values?.answer} onChange={formik.handleChange} />
              {formik.errors.answer && <FormErrorMessage>{formik.errors?.answer}</FormErrorMessage>}
            </FormControl>
            <FormControl
              id="is_correct"
              display="flex"
              alignItems="center"
              mb="4"
              isInvalid={!!formik.errors?.is_correct}
            >
              <FormLabel htmlFor="switch-is_correct">Is Correct</FormLabel>
              <Switch
                id="switch-is_correct"
                name="is_correct"
                onChange={formik.handleChange}
                value={formik.values?.is_correct ? 1 : 0}
              />
              {formik.errors?.is_correct && <FormErrorMessage>{formik.errors?.is_correct}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<TriviaQuestionInterface>
              formik={formik}
              name={'question_id'}
              label={'Select Trivia Question'}
              placeholder={'Select Trivia Question'}
              fetcher={getTriviaQuestions}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.question}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'trivia_answer',
  operation: AccessOperationEnum.UPDATE,
})(TriviaAnswerEditPage);
