<?php header('Content-Type: text/html; charset=utf-8;');

if ('www.lh-broker.com' == $_SERVER['HTTP_HOST'] || 'dev.lh-broker.com' == $_SERVER['HTTP_HOST'])
{
	if ('/spanish' == substr($_SERVER['REQUEST_URI'], 0, 8))
	{
		require_once('./index_spa.html');
	}
	else
	{
		require_once('./index_eng.html');
	}
}
else
{
    require_once('./index_rus.html');
}