library(dplyr)
library(lubridate)

# coreData created in the git/getWBCoreDataForD3FishMove subdir on Osensei
# need to export coreDataForD3.RData from Osensei and then upload here to felek 
load('WBcoreDataForD3.RData')

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
                 familyID = familyIDContinuous,
                 cohortFamilyID = cohort_familyID,
                 minSample = minSample,
                 maxSample = maxSample,
                 familyCount = familyCount, 
                 cohort = cohort,
                 dateEmigrated = dateEmigrated
               ) %>%
         filter( !is.na(len),
                 tag != "1bf0e00a52"     #temporary
                 ) # have one fish right now

out$seasonStr <- ifelse(out$season == 1, "Spring", 
                 ifelse(out$season == 2, "Summer",
                 ifelse(out$season == 3, "Autumn","Winter")))

out$age <- year( out$date ) - out$cohort

write.csv(out,file='WBcoreDataOut.csv', row.names = F)


