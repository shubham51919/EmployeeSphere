import React from 'react'
import { Skeleton, Flex } from '@fluentui/react-northstar'
const PollSkeleton = () => {
  return (
    <Skeleton
        animation="pulse"
        style={{
          border: "1px solid #E1E1E1",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        <Flex column gap="gap.small">
          <Flex gap="gap.small" vAlign="center">
            <Skeleton.Avatar name="JOHN DOE" />
            <Skeleton.Line width="20%" />
          </Flex>
          <Flex column>
            <Skeleton.Line width="60%" />
            <Skeleton.Line width="95%" />
            <Skeleton.Line width="95%" />
          </Flex>
        </Flex>
      </Skeleton>
  )
}

export default PollSkeleton