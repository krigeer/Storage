import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});


  @override
  Widget build(BuildContext context){
    return MaterialApp(
      title: 'Actividad',
    );
  }

}


class Navegacion extends StatelessWidget {
  const Navegacion({super.key});


  @override
  Widget build(BuildContext context) {
    return DefaultTabController(length: 100,
     child: Text('h')
    );
}
}
