import { Flex, Text, VStack } from "@chakra-ui/layout";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import useInView from "react-cool-inview";

import { allAcademyCategory } from "../../../data/academy";
import allCompanies from "../../../data/company";
import allJobs from "../../../data/job";
import JobTable from "../../components/job/JobTable";
import HighlightedText from "../../components/layout/HighlightedText";
import Menu from "../../components/layout/Menu";
import { useTranslate } from "../../context/TranslateProvider";
import type { Company } from "../../models/company";
import type { Job } from "../../models/job";
import type { JobFilter } from "../../models/job-filter";
import { filterJobs } from "../../services/job.service";

const LOADED_STEPS = 25;

const JobsPage: NextPage = () => {
  const { t } = useTranslate();
  const [lastIndexLoaded, setLastIndexLoaded] = useState<number>(LOADED_STEPS);
  const [companies] = useState<Company[]>(allCompanies);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilter>({
    remote: false,
    search: "",
    tags: [],
  });

  useEffect(() => {
    const newJobs = filterJobs(allJobs, filters)
      .sort((job1, job2) => (job1.createdOn > job2.createdOn ? -1 : 1))
      .slice(0, lastIndexLoaded);
    setJobs(newJobs);
  }, [filters, lastIndexLoaded]);

  const { observe } = useInView({
    // When the last item comes to the viewport
    onEnter: ({ unobserve }) => {
      // Pause observe when loading data
      unobserve();
      setLastIndexLoaded(lastIndexLoaded + LOADED_STEPS);
    },
  });

  return (
    <Flex
      w="full"
      direction="column"
      justify="flex-start"
      align="flex-start"
      transform="translateZ(0)"
    >
      <HighlightedText highlighted={t.common.job_title_main || "Jobs"} />
      {/* Sub intro text */}
      <Text
        zIndex={1}
        mt={8}
        textAlign="start"
        color="whiteAlpha.600"
        fontSize="20px"
        maxWidth="600px"
      >
        {t.common.subtitle_main}
      </Text>
      <Flex w="full" direction={{ base: "column", md: "row" }} mt={24}>
        <Menu
          tags={allAcademyCategory}
          initialValue={allAcademyCategory[0]}
          onChange={(newValue) => {
            console.log(newValue);
          }}
        />
        <VStack w="full" justify="flex-start" align="flex-start">
          <Text fontSize="6xl" fontWeight="bold">
            Featured
          </Text>
          <JobTable
            jobs={jobs}
            companies={companies}
            observe={observe}
            onFilterChanged={(updatedFilter) =>
              setFilters({ ...filters, ...updatedFilter })
            }
          />
        </VStack>
      </Flex>
    </Flex>
  );
};

export default JobsPage;
