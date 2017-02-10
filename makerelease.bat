@echo off

SET COMPILE="C:\Users\Manh Le\Desktop\Mini JavaScript\compiler.jar"
SET JAVA="C:\Program Files (x86)\Java\jre1.8.0_65\bin\java.exe"

SET DSTBROWSERPATH=release\browser
SET DSTNODEPATH=release\nodejs

SET SRCBROWSERPATH=src\browser
SET SRCNODEPATH=src\nodejs

echo ------Releasing Browser Scripts------

%JAVA% -jar %COMPILE% --compilation_level SIMPLE_OPTIMIZATIONS --js %SRCBROWSERPATH%\async8.js --js_output_file %DSTBROWSERPATH%\async8.min.js
xcopy %SRCBROWSERPATH%\async8.js %DSTBROWSERPATH%

%JAVA% -jar %COMPILE%  --compilation_level SIMPLE_OPTIMIZATIONS --js %SRCNODEPATH%\index.js --js_output_file %DSTNODEPATH%\index.js
%JAVA% -jar %COMPILE% --compilation_level SIMPLE_OPTIMIZATIONS --js %SRCNODEPATH%\MA.js --js_output_file %DSTNODEPATH%\MA.js

echo ------Completed------