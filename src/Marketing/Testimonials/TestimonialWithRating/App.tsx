import { Box, Container, Stack } from "@chakra-ui/react";
import { testimonials } from "./data";
import { Testimonial } from "./Testimonial";

export const TestimonialWithRating = () => (
  <Box as="section" py={{ base: "16", md: "24" }}>
    <Container>
      <Stack
        direction={{ base: "column", lg: "row" }}
        align={{ base: "center", lg: "stretch" }}
        spacing="16"
      >
        {testimonials.map((testimonial, id) => (
          <Testimonial key={id} {...testimonial} />
        ))}
      </Stack>
    </Container>
  </Box>
);
