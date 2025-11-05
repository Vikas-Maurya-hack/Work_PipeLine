Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "Start Work Pipeline.bat" & Chr(34), 0
Set WshShell = Nothing