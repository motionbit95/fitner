import { Badge, Flex, HStack, Icon, StackProps, Text, useColorModeValue } from '@chakra-ui/react'
import { HiStar } from 'react-icons/hi'

interface CustomerReviewsProps extends StackProps {
  rating: number
  reviewCount: number
}

export const CustomerReviews = (props: CustomerReviewsProps) => {
  const { rating, reviewCount, ...stackProps } = props
  return (
    <HStack spacing="1" {...stackProps}>
      <Badge colorScheme="orange" variant="solid" px="2" rounded="full">
        {rating}
      </Badge>
      <Flex align="center">
        {Array.from({ length: rating }).map((_, index) => (
          <Icon key={index} as={HiStar} color="orange.500" />
        ))}
      </Flex>
      <Text textStyle="sm" fontWeight="medium" color={useColorModeValue('gray.600', 'gray.300')}>
        ({reviewCount})
      </Text>
    </HStack>
  )
}
