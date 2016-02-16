library(dplyr)

# coreData created in the git/getWBCoreDataForD3FishMove subdir on Osensei
load('coreDataForD3.RData')

out <- cd %>%
         filter(year %in% 2003:2004 &  riverOrdered == "IL" ) %>%
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
                 river = riverOrdered ) %>%
         filter( !is.na(len) ) # have one fish right now

write.csv(out,file='coreDataOut.csv', row.names = F)

