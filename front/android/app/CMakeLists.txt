cmake_minimum_required(VERSION 3.13)

# Define the library name here.
project(rapido_appmodules)

# This file includes all the necessary to let you build your application with the New Architecture.
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# If you want to add a custom TurboModule or Fabric component in your app you
# will have to include the following autogenerated factories.
target_link_libraries(${PROJECT_NAME}
    ${REACT_ANDROID_TARGET}
)
