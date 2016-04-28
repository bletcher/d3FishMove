library(dplyr)

# coreData created in the git/getWBCoreDataForD3FishMove subdir on Osensei
load('coreDataForD3.RData')

out <- cd %>%
         filter(# year %in% 2003:2004
                # &  riverOrdered == "IL" 
                ) %>%
         mutate( tagFactor = as.numeric(factor(tag))) %>%
         select( tag = tag,
                 date = detectionDate, 
                 id = tagFactor, 
                 species = species, 
                 sample = sampleNumber, 
                 enc = enc, 
                 section = section, 
                 lagSection = lagSection,
                 moveDir = moveDir,
                 distMoved = distMoved,
                 len = observedLength,
                 wt = observedWeight,
                 river = riverOrdered,
                 year = year,
                 season = season,
                 familyID = familyIDContinuous,
                 cohortFamilyID = cohort_familyID,
                 minSample = minSample,
                 maxSample = maxSample) %>%
         filter( !is.na(len) ) # have one fish right now

out$seasonStr <- ifelse(out$season == 1, "Spring", 
                 ifelse(out$season == 2, "Summer",
                 ifelse(out$season == 3, "Autumn","Winter")))

write.csv(out,file='coreDataOut.csv', row.names = F)


