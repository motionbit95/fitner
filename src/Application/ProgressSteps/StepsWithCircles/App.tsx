import { Box, Container, HStack } from "@chakra-ui/react";
import { Step } from "./Step";
import { useStep } from "./useStep";

export const StepsWithCircles = (props: any) => {
  const numberOfSteps = 4;
  const { currentStep } = props;
  return (
    <Box bg="bg.surface">
      <Container
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="40"
      >
        <HStack spacing="0" justify="space-evenly" flex="1">
          {[...Array(numberOfSteps)].map((_, id) => (
            <Step
              key={id}
              // cursor="pointer"
              // onClick={() => setStep(id)}
              isActive={currentStep === id}
              isCompleted={currentStep > id}
              isLastStep={numberOfSteps === id + 1}
            />
          ))}
        </HStack>
      </Container>
    </Box>
  );
};
