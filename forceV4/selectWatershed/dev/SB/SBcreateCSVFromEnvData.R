library(dplyr)

# envData created in the git/getWBCoreDataForD3FishMove subdir on Osensei
# need to export envDataForD3.RData from Osensei and then upload here to felek 
load('envDataForD3.RData')

envData <- envData2 %>% filter(river == "west brook")
envData$year <-  as.numeric(format(envData$date,'%Y'))
envData <- envData %>% filter(!is.na(seasonFill))

write.csv(envData,file='envDataOut.csv', row.names = F)


