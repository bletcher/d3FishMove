library(dplyr)
library(lubridate)

# coreData created in Matt's .../getSBCoreDataForD3FishMove subdir on Osensei
# need to export SBcoreDataForD3.RData from Osensei and then upload here to felek 
setwd("/home/ben/d3FishMove/forceV4/selectWatershed/SB/dev")
load('SBcoreDataForD3.RData')

out <- cd %>%
         filter(# year %in% 2003:2004
                # &  riverOrdered == "IL" 
                ) %>%
         mutate( tagFactor = as.numeric(factor(tag))) %>%
         select( tag = tag,
                 date = detectionDate, 
                 id = tagFactor, 
                 species = species, 
                 sample = sampleNumber, # sampleName is the original, sampleNumber is consecutive
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
               #  familyID = familyIDContinuous,
               #  cohortFamilyID = cohort_familyID,
                 minSample = minSample,
                 maxSample = maxSample,
              #   familyCount = familyCount, 
                 cohort = cohort
              #   dateEmigrated = dateEmigrated
               ) %>%
         filter( !is.na(len) ) # holdover from WB

out$seasonStr <- ifelse(out$season == 2, "Spring", 
                 ifelse(out$season == 3, "Autumn",NA))

out$riverStr <- ifelse(out$river == "M", "mainstem", 
                ifelse(out$river == "W", "west",
                ifelse(out$river == "E", "east",NA)))

out$sample[out$sample == 2.5] <- 3
out$sample[out$sample == 10.1] <- 10

out$age <- year( out$date ) - out$cohort

out$riverStr <- ifelse( out$riverStr == "mainstem" & out$section %in% 1:6, "tidal", out$riverStr )

write.csv(out,file='SBcoreDataOut.csv', row.names = F)


