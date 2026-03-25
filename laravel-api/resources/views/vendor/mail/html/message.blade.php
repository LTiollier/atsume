@props(['primaryColor' => null])

<x-mail::layout>
{{-- Per-user palette override injected in <head> --}}
@if($primaryColor)
<x-slot:head>
<style>
a:not(.button){color:{{ $primaryColor }}!important;}
.button-blue,.button-primary{background-color:{{ $primaryColor }}!important;border-bottom-color:{{ $primaryColor }}!important;border-left-color:{{ $primaryColor }}!important;border-right-color:{{ $primaryColor }}!important;border-top-color:{{ $primaryColor }}!important;color:#160403!important;}
.panel{border-left-color:{{ $primaryColor }}!important;}
</style>
</x-slot:head>
@endif

{{-- Header --}}
<x-slot:header>
<x-mail::header :url="config('app.url')">
{{ config('app.name') }}
</x-mail::header>
</x-slot:header>

{{-- Body --}}
{!! $slot !!}

{{-- Subcopy --}}
@isset($subcopy)
<x-slot:subcopy>
<x-mail::subcopy>
{!! $subcopy !!}
</x-mail::subcopy>
</x-slot:subcopy>
@endisset

{{-- Footer --}}
<x-slot:footer>
<x-mail::footer>
© {{ date('Y') }} {{ config('app.name') }}. @lang('All rights reserved.')
</x-mail::footer>
</x-slot:footer>
</x-mail::layout>
