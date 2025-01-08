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
        maxHeight:"20%",        width: "100%",
        border: "1px solid #E1E1E1",
        borderRadius: "8px",
      }}
    >
      <Skeleton animation="pulse" className="ca-skeleton">
        <Flex column gap="gap.small">
          <Flex gap="gap.small" vAlign="center">
            <FlexItem>
              <SkeletonLine width="50%" />
              <SkeletonLine width="100%" />
            </FlexItem>
          </Flex>
        </Flex>
      </Skeleton>
    </Flex>
  );
};

export default PostSkeleton;
