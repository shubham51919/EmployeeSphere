import React from "react";
import {
  Flex,
  FlexItem,
  Skeleton,
  SkeletonAvatar,
  SkeletonLine,
  SkeletonShape,
  SkeletonText,
  SkeletonInput,
} from "@fluentui/react-northstar";
import _ from "lodash";
const PostSkeleton = () => {
  return (
    <Flex
      className="skeleton-main-section"
      style={{
        width: "100%",
        border: "1px solid #E1E1E1",
        borderRadius: "8px",
      }}
    >
      <Skeleton animation="pulse" className="ca-skeleton">
        <Flex column gap="gap.small">
          <Flex gap="gap.small" vAlign="center">
            <FlexItem>
              <SkeletonAvatar />
            </FlexItem>
            <FlexItem>
              <SkeletonLine width="50%" />
            </FlexItem>
          </Flex>
          <Flex>
            <SkeletonShape width="100%" />
          </Flex>
          <Flex column gap="gap.small">
            {
              _.times(4, (i) => (
                <SkeletonText key={i} />
              )) // eslint-disable-line react/no-array-index-key
            }
          </Flex>
          <Flex>
            <SkeletonInput fluid />
          </Flex>
        </Flex>
      </Skeleton>
    </Flex>
  );
};

export default PostSkeleton;
